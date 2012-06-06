(function() {

$("#page-addsite").live('pageshow',function() {

    UMM.setupPage();
    UMM.logInfo("Page show fired");

    console.log(UMM.cfg);

    $("#bcancel").click(function(){
        window.close();
    });

    $("#ipassword").keypress(function(e) {
        var c = e.which ? e.which : e.keyCode;
        if(c == 13) {
            jQuery('#bsave').focus().click();
        }
    });

    // Saving new site configuration.
    $("#bsave").click(function(){

        // Check if we are connected to Internet
        if(! UMM.connectionOn){
            UMM.popErrorMessage("Internet connection required to perform this action");
            return;
        }

        // Check for a correct URL
        var siteurl =  $.trim($("#isiteurl").val());
        var username = $.trim($("#iusername").val());
        var password = $.trim($("#ipassword").val());
        var mytoken;

        // Delete the last / if present
        if(siteurl.charAt(siteurl.length-1) == '/'){
            siteurl = siteurl.substring(0,siteurl.length-1);
        }

        var stop = false;
        var msg = "";

        if(siteurl.indexOf("http://localhost") == -1 && ! /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(siteurl)){
            msg += "Bad URL<br/>";
            stop = true;
        }

        if(!username){
            // TODO
            msg += "Missing username<br/>";
            stop = true;
        }
        if(!password){
            // TODO
            msg += "Missing password<br/>";
            stop = true;
        }

        if(stop){
            UMM.popErrorMessage(msg);
            return;
        }

        function addSite(site) {

            // Call to the API for complete the user login.
            UMM.completeUserLogin(site, mytoken);

            $.mobile.changePage(UMM.cfg.wwwroot + "/main.html", 'slideup');
        }

        $.mobile.showPageLoadingMsg();
        $.getJSON(siteurl+"/login/token.php",
            {
                username: username,
                password: password,
                service: UMM.cfg.wsservice
            }
            ,function(json) {
                if(typeof(json.token) != 'undefined'){
                    mytoken = json.token;

                    var data = {};
                    var preSets = {
                        wstoken: mytoken,
                        siteurl: siteurl
                    }
                    UMM.moodleWSCall('moodle_webservice_get_siteinfo', data, addSite, preSets);

                }
                else{
                    UMM.popErrorMessage("Problem connecting to the Moodle site");
                }
            });
    });
});

})();