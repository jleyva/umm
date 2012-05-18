(function() {

    $("#page-mysite").live('pageshow',function() {

        UMM.setupPage();
        UMM.logInfo("Page show fired");

        var currentSite = UMM.getRecord("sites", {id: UMM.cfg.current_site});

        if(currentSite){
            $("#sitename").html(currentSite.sitename);
            
            var modules = UMM.cfg.modules.split(",");
            for (var i in modules) {
                var module = $.trim(modules[i]);                
                // Lazy load of modules.
                UMM.loadModule(module);
                $("#appbuttons").append(UMM.mod[module].renderButton());
                
                // Post render hook.
                if (typeof UMM.mod[module].postRenderButton != "undefined") {
                    UMM.mod[module].postRenderButton();
                }
            }

        } else{
            $.mobile.changePage("addsite.html");
        }

    });

})();