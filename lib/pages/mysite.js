(function() {
    
    $("#page-mysite").live('pageshow',function() {
        
        setupPage();
        logInfo("Page show fired");
        
        var sites = localStorage.getItem("sites");
                                
        if(sites){                
            sites = JSON.parse(sites);
            var currentSite = sites[localStorage.getItem("current_site")];
            $("#sitename").html(currentSite.sitename);
            
            $("#linkweb").click(function(event){
                $(this).attr("href",currentSite.siteurl)
            });
            
        }
        else{
            $.mobile.changePage("addsite.html");
        }
        
    });
    
})();