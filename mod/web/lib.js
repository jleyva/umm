UMM.mod.web = {

    cfg: {},

    init: function (){        
        return;  
    },

    renderButton: function() {
        var iconurl = UMM.cfg.wwwroot + "/";

        if (parseInt(UMM.cfg.theme_mod_icons)) {
            iconurl += UMM.cfg.theme + "/pix/i/web.png";
        } else {
            iconurl += "mod/web/icon.png";
        }

        return '<a href="#" id="linkweb" rel="external" target="_blank" style="text-decoration: none">\
                        <span class="ui-btn ui-btn-icon-top ui-btn-corner-all ui-shadow ui-btn-up-c">\
                            <br/>\
                            <img src="' + iconurl + '"><br/>\
                            <span data-lang="web">web</span>\
                            <br/>\
                        </span>\
                    </a>';
    },

    postRenderButton: function() {
        $("#linkweb").click(function(event){                
                $(this).attr("href",UMM.cfg.current_siteurl)
            });
    }
}