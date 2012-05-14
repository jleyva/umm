(function() {

    $("#page-mysites").live('pagebeforeshow',function() {
                
        setupPage();
        logInfo("Page before show fired");
        
        var sites = localStorage.getItem("sites");
                                
        if(sites){                
            sites = JSON.parse(sites);
            var currentSite = sites[localStorage.getItem("current_site")];
            
            $("#lmysites li").remove();
            
            var sitename = '';                                           
            $.each(sites, function(index,site){
                if(index+'' == localStorage.getItem("current_site")){
                    sitename = '<h3>'+site.sitename+' (Current)</h3>';    
                }
                else{
                    sitename = '<h3>'+site.sitename+'</h3>';
                }
                
                $("#lmysites").append('<li><a id="site'+index+'" data-siteid="'+index+'"><img src="'+site.userpictureurl+'" />'+sitename+'<p>'+site.fullname+'</p></a></li>');
                $("#site"+index).click(function(){                        
                    localStorage.setItem("current_site",$(this).attr('data-siteid'))
                    $.mobile.changePage("mysite.html");
                });
            });
            
            $('#lmysites').listview('refresh');
        }
        else{
            $.mobile.changePage("addsite.html");
        }
        
    });
    
})();