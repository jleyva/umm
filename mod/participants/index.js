(function() {
    $("#page-participants").live('pageshow',function() {
        console.log("abc");
        UMM.setupPage();
        UMM.setParams({
                        firstdestination: UMM.cfg.wwwroot + "/user/index.html",
                        seconddestination: UMM.cfg.wwwroot + "/mod/participants/user.html"
        });
        $.mobile.changePage(UMM.cfg.wwwroot + "/course/index.html", 'none');
    });

})();