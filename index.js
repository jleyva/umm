(function() {

$("#page-index").live('pagebeforeshow',function() {

        // We do no call here setupPage here intentionallity.
        MM.init();

        // First we check if the user is currently authenticated.
        var loggedin = MM.cfg.current_site && MM.cfg.current_token;

        if(loggedin) {
            $.mobile.changePage("main.html");
        }
        else {
            // Redirect the user to the current mobile authentication index.
            $.mobile.changePage(MM.authIndex());
        }
    });

})();
