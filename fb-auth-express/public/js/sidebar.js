$(document).ready(function() {
    // console.log( "ready!" );

    // Closes the sidebar menu
    $("#menu-close").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });

    // Opens the sidebar menu
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        //- console.log("MY OP");
        $("#sidebar-wrapper").toggleClass("active");
    });
});