(function() {

    $("#page-help").live('pageshow',function() {
            
        setupPage();
        
        var sites = localStorage.getItem("sites");
        
        if(sites){
            $('#iweb').attr('src','http://docs.moodle.org/21/en/Main_page');
            $("#help").html('Docs');
        }
        else{
            $.mobile.changePage("addsite.html");
        }            
    });
    
})();