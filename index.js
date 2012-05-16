(function() {

$("#page-index").live('pagebeforeshow',function() {

        // We do no call here setupPage here intentionallity.
        UMM.init();

        // First we check if the user is currently authenticated.
        var auth = UMM.getConfig("umm", "user_authenticated");

        if(parseInt(auth) == 1) {
            $.mobile.changePage("main.html");
        }
        else {
            // Redirect the user to the current mobile authentication index.
            $.mobile.changePage(UMM.auth_index());
        }
    });

})();
