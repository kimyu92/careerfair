var host = "http://"+window.location.host;

$(document).ready(function(){
	//Edit button to update the note
	$('body').on('click', '#updateBtnID', function(){
		
		/* company id*/
		var id = $(this).closest('.event').children('#comID').text();
		var fbid = $('#fbID').text();
		var note = $(this).siblings().find('#myNoteID').val();

		// alert(id + " "+ fbid);
		// alert(note);

		var postData={id:id,fbid:fbid,note:note};

		$.ajax({
        	url: host+'/update/note',
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

	//Delete the actual note
	$('body').on('click', '#ima', function(){
		var id = $(this).closest('.event').children('#comID').text();
		var fbid = $('#fbID').text();

		// alert(id + " "+ fbid);

		var postData={id:id,fbid:fbid};

		$.ajax({
        	url: host+'/delete/note',
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
		// alert("deleted on db");
	});

});