(function() {
    $("#page-participants").live('pageshow',function() {
        console.log("abc");
        UMM.setupPage();
        UMM.setParams({destinationcourse: UMM.cfg.wwwroot + "/user/index.html"});
        $.mobile.changePage(UMM.cfg.wwwroot + "/course/index.html", 'none');
    });
    
})();