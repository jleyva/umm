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
            
            localStorage.setItem('cache_time', parseInt($("#cache_expiration").val()) * 1000);
            
            popMessage("Settings saved");            
            setTimeout('$.mobile.changePage("mysite.html")',2000);
        });
        
        $("#bpurge").click(function(){
            var l = localStorage.length;
            
            for (var i=0; i<l; i++){
                var key = localStorage.key(i);
                if(key !== null && key.indexOf('cache_') == 0){
                    localStorage.removeItem(key);
                }
            }
            popMessage("Caches purged");
        });
        
        // Initialization        
        $(":checkbox").each(function(index,elem){           
                var currentVal = localStorage.getItem($(this).attr('id'));
                if(currentVal == "1"){                                        
                    $(this).attr('checked',true).checkboxradio("refresh");                    
                }
                else{                    
                    $(this).attr('checked',false).checkboxradio("refresh");                    
                }
        });
        
        $("#cache_expiration").val(cacheExpirationTime / 1000).slider("refresh");        
        
    });
    
})();