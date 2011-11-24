(function() {

    $("#page-web").live('pageshow',function() {
    
        logInfo("Page show fired");
        setupPage();
        
        var sites = JSON.parse(localStorage.getItem("sites"));
        var siteurl = sites[localStorage.getItem("current_site")].siteurl;
        
                                
        if(sites){
            $('#iweb').attr('src',siteurl);
            $("#siteurl").html(siteurl+'/');
        }
        else{
            $.mobile.changePage("addsite.html");
        }
    });
    
})();