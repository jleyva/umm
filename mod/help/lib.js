UMM.mod.help = {

    cfg: {},

    init: function (){        
        return;  
    },

    renderButton: function() {
        var iconurl = UMM.cfg.wwwroot + "/";

        if (parseInt(UMM.cfg.theme_mod_icons)) {
            iconurl += UMM.cfg.theme + "/pix/i/help.png";
        } else {
            iconurl += "mod/help/icon.png";
        }

        return '<a href="' + UMM.cfg.wwwroot + "/mod/help/index.html" + '" rel="external" target="_blank" style="text-decoration: none">\
                        <span class="ui-btn ui-btn-icon-top ui-btn-corner-all ui-shadow ui-btn-up-c">\
                            <br/>\
                            <img src="' + iconurl + '"><br/>\
                            <span data-lang="help">help</span>\
                            <br/>\
                        </span>\
                    </a>';
    }
    
}