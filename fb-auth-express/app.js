var express           =     require('express')
  , passport          =     require('passport')
  , util              =     require('util')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('./configuration/config')
  , mysql             =     require('mysql')
  , fse               =     require('fs-extra')
  , app               =     express();

//Define MySQL parameter in Config.js file.
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

//Connect to Database only if Config.js parameter is set.

if(config.use_database==='true')
{
    connection.connect();
}

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the FacebookStrategy within Passport.

passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url,
    authorizationURL: 'https://www.facebook.com/v2.2/dialog/oauth',
    tokenURL: 'https://graph.facebook.com/v2.2/oauth/access_token',
    profileURL: 'https://graph.facebook.com/v2.2/me',
    profileFields: ['id', 'name', 'picture.type(large)', 'emails', 'displayName', 'about', 'gender', 'locale', 'location', 'hometown']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      if(config.use_database === 'true'){
        connection.query("SELECT * from user_info where user_id="+profile.id.toString(),function(err,rows,fields){
          if(err)
            throw err;
          if(rows.length === 0){
            console.log("There is no such user, adding now");
            connection.query("INSERT into user_info(user_id,user_name,user_email,user_gender) VALUES('" + profile.id.toString() + "','" + 
                                                                                                          profile.displayName + "','" +
                                                                                                          profile.emails[0].value + "','" + 
                                                                                                          profile.gender + "')");
          }
          else {
            console.log("User already exists in database");
          }
        });
      }
      
      return done(null, profile);
    });
  }
));



function insert_companies_information(){

  if(config.use_database === 'true'){
    
    connection.query("SELECT * from company where id=0",function(err,rows,fields){
      if(err) throw err;
        
      if(rows.length === 0){
        console.log("There is no company, initializing aka inserting now");
        
        var jsonObj = JSON.parse(fse.readFileSync('./public/data/data.json', 'utf8'));
        //console.log("Json object "+ jsonObj);
        for (var i = 0; i < jsonObj.length; i++) {
          connection.query("INSERT into company(name,authorization,degrees,position,booth) VALUES('" + jsonObj[i]["Organization Name"] + "','" + 
                                                                                                       jsonObj[i]["Work Authorization"] + "','" +
                                                                                                       jsonObj[i]["Degrees Sought"] + "','" +
                                                                                                       jsonObj[i]["Position Types"] + "','" +
                                                                                                       jsonObj[i]["Booth"] + "')");
        };
        console.log("Insertion of companies completed");
      }
      else
        console.log("User already exists in database");

    });
  }
}


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

/* Server configuration */
//Set the port 
app.set('port', (process.env.PORT || 3000));

//Specify the views folder
app.set("views", __dirname + "/views");

//View engine is Jade
app.set("view engine", "jade");


app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: 'keyboard cat', 
				          key: 'sid',
				          resave: true, 
				          saveUninitialized: true
				        }));

app.use(passport.initialize());

app.use(passport.session());

//Specify where the static content is
app.use(express.static(__dirname + '/public'));

app.use(allowCrossDomain);


/* Any CRUD goes here */

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user});
});

app.get('/auth/facebook', passport.authenticate('facebook',{scope:['email']}));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


/* GET the company data*/
app.get('/company',function(req,res){
  
  connection.query("select * from company", function(err,rows,fields){
    if(err) throw err;
    res.end(JSON.stringify(rows));
  });

});

/* GET search company name*/
app.get('/search',function(req,res){
  connection.query('SELECT * from company where name like "%'+req.query.key+'%"', function(err, rows, fields) {
    if (err) throw err;
    var data = [];
    
    for(var i = 0; i < rows.length; i++){
      data.push(rows[i].name);
    }
    
    res.end(JSON.stringify(data));
  });
});

/* User interested on this company */
app.post('/add/company', function(req,res,next){
  var user_id = req.body.fbid;
  var company_id = parseInt(req.body.id);

  console.log(user_id);
  console.log(company_id);

 

  connection.query('SELECT * FROM users_companies WHERE user_id = ? AND company_id=? ', [user_id, company_id], function(err, rows, fields) {
    if (err) throw err;

    if(rows.length === 0){
      console.log('User has NOT added this company to his plan yet. The system will add it to the record now');
      connection.query("INSERT into users_companies(user_id,company_id) VALUES('" + user_id + "','" + 
                                                                                    company_id + "')");
    }
    else{
      console.log('User has added this company to his plan');
    }

  });
  
});

/* Get back company added into list */
app.get('/retrieve/plan', function(req,res){
  
  //req.query.user_id, param is user_id
  var user_id = req.query.user_id;
  
  connection.query('SELECT * FROM users_companies WHERE user_id = ?', user_id, function(err,rows,fields){
    if(err) throw err;

    console.log("Retrieve the plan detail");
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rows));
  });
  
});


/* Get back single company detail */
app.get('/retrieve/company', function(req,res){
  
  //req.query.user_id, param is user_id
  var company_id = req.query.company_id;
  
  connection.query('SELECT * FROM company WHERE id = ?', company_id, function(err,rows,fields){
    if(err) throw err;

    console.log("Retrieve a single company detail");
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rows));
  });
  
});


/* User interested on this company */
app.post('/update/note', function(req,res,next){
  var user_id = req.body.fbid;
  var company_id = parseInt(req.body.id);
  var note = req.body.note;

  console.log("Updating note");
  console.log(note);
  console.log(user_id);
  console.log(company_id);

 
  //UPDATE table_name SET field1=new-value1, field2=new-value2
  connection.query('UPDATE users_companies SET note = ? WHERE user_id = ? AND company_id=? ', [note, user_id, company_id], function(err, rows, fields) {
    if (err) throw err;

      console.log('Updated note');

  });
  
});


/* User deleted note on this company */
app.post('/delete/note', function(req,res,next){
  var user_id = req.body.fbid;
  var company_id = parseInt(req.body.id);
  
  console.log("Deleting note");
  console.log(user_id);
  console.log(company_id);

 
  //DELETE FROM table_name [WHERE Clause]
  connection.query('DELETE FROM users_companies WHERE user_id = ? AND company_id=? ', [user_id, company_id], function(err, rows, fields) {
    if (err) throw err;

      console.log('Delete note');

  });
  
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.listen(app.get("port"), function(){
  insert_companies_information();
  console.log('listening on *:'+ app.get("port") );
});
