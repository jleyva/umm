MM.mod.web = {

    cfg: {},

    init: function (){        
        return;  
    },

    renderButton: function() {
        var iconurl = MM.cfg.wwwroot + "/";

        if (parseInt(MM.cfg.theme_mod_icons)) {
            iconurl += MM.cfg.theme + "/pix/i/web.png";
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
                $(this).attr("href",MM.cfg.current_siteurl)
            });
    }
}