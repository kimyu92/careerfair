var host = "http://"+window.location.host;

$(document).ready(function(){

	$('body').on('click', '#addCompanyID', function(){
		var $row = $(this).closest("tr");
		
		/* company id*/
		var id = $row.find("#tdID").text();
		
		/* facebook id*/
		var fbid = $('#fbID').text();
		//alert("Kimchi" + id + fbid); 
		
		var postData={id:id,fbid:fbid};

		$.ajax({
        	url: host+'/add/company',
        	// dataType: "jsonp",
        	data: postData,
        	type: 'POST',
        	jsonpCallback: 'callback', // this is not relevant to the POST anymore
        	success: function (data) {
            	var ret = jQuery.parseJSON(data);
            	console.log('Success: ')
        	},
        	error: function (xhr, status, error) {
            	console.log('Error: ' + error.message);
        	},
    	});


	});
});