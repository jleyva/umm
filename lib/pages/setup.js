(function() {

    $("#page-setup").live('pageshow',function() {
            
        setupPage();
        logInfo("Page show fired");
        
        $("#bsave").click(function(){
            $(":checkbox").each(function(index,elem){
                if($(this).is(':checked')){
                    localStorage.setItem($(this).attr('id'),"1");
                }
                else{
                    localStorage.setItem($(this).attr('id'),"0");                    
                }
            });
            $.mobile.changePage("mysite.html");
        });
        
        
        $(":checkbox").each(function(index,elem){           
                var currentVal = localStorage.getItem($(this).attr('id'));
                if(currentVal == "1"){                                        
                    $(this).attr('checked',true).checkboxradio("refresh");                    
                }
                else{                    
                    $(this).attr('checked',false).checkboxradio("refresh");                    
                }
        });
    });
    
})();