MM.mod.contents = {

    cfg: {},

    init: function (){        
        return;  
    },

    renderButton: function() {
        var iconurl = MM.cfg.wwwroot + "/";

        if (parseInt(MM.cfg.theme_mod_icons)) {
            iconurl += MM.cfg.theme + "/pix/i/contents.png";
        } else {
            iconurl += "mod/contents/icon.png";
        }

        return '<a href="' + MM.cfg.wwwroot + "/mod/contents/index.html" + '" style="text-decoration: none">\
                        <span class="ui-btn ui-btn-icon-top ui-btn-corner-all ui-shadow ui-btn-up-c">\
                            <br/>\
                            <img src="' + iconurl + '"><br/>\
                            <span data-lang="contents">contents</span>\
                            <br/>\
                        </span>\
                    </a>';
    }
    
}