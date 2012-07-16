(function() {
    $("#page-participants").live('pageshow',function() {
        console.log("abc");
        MM.setupPage();
        MM.setParams({
                        firstdestination: MM.cfg.wwwroot + "/user/index.html",
                        seconddestination: MM.cfg.wwwroot + "/mod/participants/user.html"
        });
        $.mobile.changePage(MM.cfg.wwwroot + "/course/index.html", 'none');
    });

})();