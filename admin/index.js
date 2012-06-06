(function() {

    $("#page-setup").live('pageshow',function() {

        UMM.setupPage();
        UMM.logInfo("Page show fired");

        $("#bsave").click(function(){
            $(":checkbox").each(function(index,elem){
                if($(this).is(':checked')){
                    UMM.setConfig($(this).attr('id'), "1");
                }
                else{
                    UMM.setConfig($(this).attr('id'), "0");
                }
            });

            localStorage.setItem('current_lang', $("#select-choice-lang").val());
            currentLang = $("#select-choice-lang").val();
            UMM.loadLang(currentLang, UMM.translatePage);
            UMM.setConfig('lang', currentLang);

            UMM.setConfig('cache_time', parseInt($("#cache_expiration").val()) * 1000);

            UMM.popMessage("Settings saved");
            setTimeout('$.mobile.changePage("main.html")',2000);
        });

        $("#bpurge").click(function(){
            var l = localStorage.length;

            for (var i=0; i<l; i++){
                var key = localStorage.key(i);
                if(key !== null && key.indexOf('cache_') == 0){
                    localStorage.removeItem(key);
                }
            }
            UMM.popMessage("Caches purged");
        });

        // Initialization
        $(":checkbox").each(function(index,elem){
                var currentVal = "";

                if (typeof UMM.cfg[$(this).attr('id')] != "undefined") {
                    currentVal = UMM.cfg[$(this).attr('id')];
                }

                if(currentVal == "1"){
                    $(this).attr('checked',true).checkboxradio("refresh");
                }
                else{
                    $(this).attr('checked',false).checkboxradio("refresh");
                }
        });

        $("#select-choice-lang").html('');
        var elSelected = '';
        for(var el in UMM.cfg.languages){
            elSelected = '';
            if(el == UMM.cfg.lang){
                elSelected = ' selected = "selected"';
            }
            $("#select-choice-lang").append('<option value="'+el+'" '+elSelected+'>'+UMM.cfg.languages[el]+'</option>');
        }
        $("#select-choice-lang").selectmenu('refresh');

        $("#cache_expiration").val(UMM.cfg.cache_time / 1000).slider("refresh");

    });

})();