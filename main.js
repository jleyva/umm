(function() {

    $("#page-mysite").live('pageshow',function() {

        MM.setupPage();
        MM.logInfo("Page show fired");

        var currentSite = MM.getRecord("sites", {id: MM.cfg.current_site});

        if(currentSite){
            $("#sitename").html(currentSite.sitename);
            
            var modules = MM.cfg.modules.split(",");
            for (var i in modules) {
                var module = $.trim(modules[i]);                
                // Lazy load of modules.
                MM.loadModule(module);
                $("#appbuttons").append(MM.mod[module].renderButton());
                
                // Post render hook.
                if (typeof MM.mod[module].postRenderButton != "undefined") {
                    MM.mod[module].postRenderButton();
                }
            }

        } else{
            $.mobile.changePage("addsite.html");
        }

    });

})();