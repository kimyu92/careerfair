var host = "http://"+window.location.host;
$(document).ready(function(){
    $('#auto').typeahead({
        remote: host+'/search?key=%QUERY',
        limit: 10
    });
});