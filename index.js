(function() {

$("#page-index").live('pagebeforeshow',function() {  
            
        // We do no call here setupPage here intentionallity
        
        // First we check if there is almost one site configured        
        var sites = localStorage.getItem("sites");            
        
        if(sites){
            $.mobile.changePage("mysite.html");
        }
        else{
            $.mobile.changePage("addsite.html");
        }
    }); 
    
})();