(function() {

$("#page-index").live('pagebeforeshow',function() {

        // We do no call here setupPage here intentionallity.
        UMM.init();

        // First we check if the user is currently authenticated.
        var loggedin = UMM.cfg.current_site && UMM.cfg.current_token;

        if(loggedin) {
            $.mobile.changePage("main.html");
        }
        else {
            // Redirect the user to the current mobile authentication index.
            $.mobile.changePage(UMM.authIndex());
        }
    });

})();
