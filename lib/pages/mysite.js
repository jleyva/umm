(function() {

    $("#page-mysite").live('pageshow',function() {
        
        setupPage();
        
        var sites = localStorage.getItem("sites");
                                
        if(sites){                
            sites = JSON.parse(sites);
            var currentSite = sites[localStorage.getItem("current_site")];
            $("#sitename").html(currentSite.sitename);
        }
        else{
            $.mobile.changePage("addsite.html");
        }
        
    });
    
})();