var host = "http://"+window.location.host;

$(document).ready(function(){
	
	$('#clickFullListID').on('click', function(){
		if(!$('#clickFullListID').hasClass("active")){
			$('#clickPlanID').removeClass('active');
			$('#clickFullListID').addClass('active');
			$('#myPlanID').hide();
			$('#fullListFeatureID').show();
		}
	});

	$('#clickPlanID').on('click', function(){
		if(!$('#clickPlanID').hasClass("active")){
			$('#clickFullListID').removeClass('active');
			$('#clickPlanID').addClass('active');
			$('#fullListFeatureID').hide();
			$('#myPlanID').show();
			$('#myPlanID').empty();
			getDataFromServer();
		}

	});

});


function getDataFromServer(){
	var fbid = $('#fbID').text();

	// {"user_id":"10153071248019280","company_id":1,"note":null,"checkin":0}
	var user_id;
	var company_id;
	var note;
	var checkin;

	var company_name;
	var position;
	var authorization;
	
	$.ajax({
    	url: host+'/retrieve/plan',
    	type: 'GET',
    	async: false,
    	data: {user_id: fbid},
    	success: function (data) {
    		for(var i = 0; i < data.length; i++){
    			user_id = data[i].user_id;
    			company_id = data[i].company_id;
    			note = data[i].note;
    			checkin = data[i].checkin;
    			
    			//trim empty string
    			if(note === null)
    				note = "empty";


				$.ajax({
					url: host+'/retrieve/company',
					type: 'GET',
					async: false,
					data: {company_id: parseInt(company_id)},
					success: function (cdata) {
						company_name = cdata[0].name;
						position = cdata[0].position;
						authorization = cdata[0].authorization;

						$('#myPlanID').append('<div id="interestedCompanyID'+company_id+'" class="alert event current" ">' +
                                            	'<button id="taskDeleteID" type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                                              		'<span id="ima" aria-hidden="true">&times;</span>' +
                                            	'</button>' +
	                                            	'<h4 id="comID">' + company_id + '</h4><br>' +
	                                            	'<h5>' + company_name + '</h5><br>' +
	                                            	'<p class="text-centered"><h6>position: ' + position + '</h6><br>' +
	                                            	'<h6>authorization: ' + authorization + '</h6><br>' +
	                                            	'<h6>checkin: ' + checkin + '</h6></p><br>' +
	                                            	'<form role="form">' +
        												'<div class="row">' +
            												'<div class="form-group">' +
              													'<label for="code">Note:</label>' +
              													'<input id="myNoteID" type="text" value="'+ note +'" class="form-control input-lg">' +
            												'</div>' +
        												'<button id="updateBtnID" type="submit" class="btn btn-default">Edit</button>'+
        												'</div>' +
        											'</form>' +
                                          	'</div>');

					}
				});

    		}
    	}
	});
}