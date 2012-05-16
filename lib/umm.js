/**
 * Basic setup for every page
 *
 * Despiste this file is included in all the pages, this is going to be included only one time in a mobile device
 * This is because jqueryMobile load via AJAX the body of the pages and not the head elements
 *
 * @package core
 * @copyright Juan Leyva <juanleyvadelgado@gmail.com>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

var UMM = {
    
    cfg: [],
    
    debugOn: false,
    
    debugInfo: "",
    
    pageReady: false,
    
    deviceReady: false,
    
    // In milliseconds.
    cacheExpirationTime: 300000,
    
    connectionOn: false,
    
    lang: {        
        languages: {"es": "Español", "en": "English", "ca" : "Catalá", "fr" : "Français", "ru" : "русский язык"},
        currentLang: this.defaultLang,
        // Cache for lang strings.
        langStrings: []
    },
    
   
    // Functions.
    
    // This function is called the first time the app is started.    
    init: function() {
        
        // Loadding settings.
        
        // First load the config.json settings.
        this.loadConfig();
        
        // Detect www root.
        this.cfg.wwwroot = location.href.replace("/index.html","");
        
        this.loadLang(this.cfg.lang);
    
        $(document).bind("mobileinit", function () {
            $.mobile.allowCrossDomainPages = true;
            $.support.cors = true;
        
            // Enable or disable page transitions (visual effect)
            var transitionsOn = localStorage.getItem('transitions_on');
            if (transitionsOn != "1") {
                $.mobile.defaultPageTransition = 'none';
            }
        
            UMM.logInfo("Mobile init fired");
        });
        
        $(document).ready(function() {
            this.pageReady = true;
            UMM.logInfo("Page ready fired");
        });
        
        $(document).bind("this.deviceReady", function(){
            this.deviceReady = true;
            UMM.logInfo("Device ready fired");
        });
        
        if (typeof(console) == "undefined") {
            // For Windows Phone 7.x.
            window.console = { log: function (str) { window.external.Notify(str); } };
            // Output any errors to console log, created above.
            window.onerror = function (msg,url,linenumber) {
              console.log("umm: " + msg + " in " + url + " at line " + linenumber);
            };
        }
    },

    auth_index: function() {        
        return this.cfg.wwwroot + "/auth/" + this.cfg.auth + "/index.html";
    },

    logInfo: function(info){
        if(this.debugOn){
    
            info = "umm: "+info;
    
            if (typeof(console) != "undefined") {
                console.log(info);
            }
            
            // Check if we can append in somewhere.
            if (this.pageReady && $("div[data-role='content']").length) {
                $("div[data-role='content']").append(this.debugInfo+'<span class="debuginfo">'+info+"<br /></span>");
                this.debugInfo = "";
            } else {
                this.debugInfo += '<span class="debuginfo">'+info+"<br /></span>";
            }
        }
    },
    
    // Common setup for pages.
    setupPage: function(){
        
        this.loadConfig();
        // Cleaning old debug info
        $(".debuginfo").remove();
    
        // Handling mobile init
        $(document).bind("mobileinit", function () {
            UMM.logInfo("Mobile init fired");
        });
    
        // For emulating without errors in ripple or a browser
        this.loadFakePhonegap();
    
        // Loading page settings
        var debugVal = this.getConfig('umm', 'debug_on');
        if(debugVal == "1"){
            this.debugOn = true;
        }
    
        var cacheTimeVal = this.getConfig('umm', 'cache_time');
        if(cacheTimeVal !== null){
            this.cacheExpirationTime = parseInt(cacheTimeVal);
        }
    
        this.connectionOn = this.checkConnection();
    
        if(! this.connectionOn){
            UMM.logInfo("Mobile is not connected to Internet");
        }
    
        // AJAX error handling
        $.ajaxSetup({"error":function(XMLHttpRequest,textStatus, errorThrown) {
            UMM.popErrorMessage("Could not connect to the Moodle site");
            UMM.logInfo("AJAX error: "+textStatus);
        }});
    
        // Localization
        this.lang.currentLang = this.getConfig('umm','current_lang');
        if(this.lang.currentLang === null){
            this.lang.currentLang = this.cfg.lang;
        }
        this.loadLang(this.lang.currentLang, this.translatePage);
    
        UMM.logInfo("Page setup finished");
    },
    
    loadConfig: function() {
        $.ajax({
          type: "GET",
          url: "config.json",
          dataType: 'json',
          async: false,
          success: function(data){
            // JSON response is an object, back to array.
            // TODO, Improve this using UMM.cfg = $.makeArray(data); or similar:
            for (var el in data) {
                UMM.cfg = data;
            }
          }
        });

        // Then load the database settings.
        var configs = this.getConfig('umm');
        
        for (var el in configs) {
            this.cfg[el] = configs[el];
        }
    },
    
    getConfig: function(plugin, name) {
        if (typeof name == "undefined") {
            var configs = {};
            for (var i=0, l=localStorage.length; i<l; i++) {
                    var key = localStorage.key(i);                    
                    
                    if (key.indexOf("config_" + plugin) == 0) {
                        var config = key.replace("config_" + plugin + "_", "");
                        
                        if (typeof this.cfg[config] == "undefined") {
                            configs[config] = localStorage[key];
                        }
                    }
            }
            return configs;
        } else {
            return localStorage.getItem("config_" + plugin + "_" +name);
        }
    },
    
    setConfig: function(name, value, plugin) {        
        localStorage.setItem("config_" + plugin + "_" +name, value);
    },
    
    loadLang: function(lang, callback) {
        
        if (typeof callback == "undefined") {
            callback = function() { return; };
        }
        
        if (typeof(this.lang.langStrings[lang]) != 'undefined'){
            callback();
            return;
        }
    
        $.ajax({
          type: "GET",
          url: UMM.cfg.wwwroot + "/lang/"+lang+".json",
          dataType: 'json',
          success: function(data){
            UMM.lang.langStrings[lang] = data;
            callback();
          }
        });
    },
    
    getString: function(id){
        var translated = '';
        if(typeof(UMM.lang.langStrings[this.lang.currentLang][id]) !== "undefined"){
            translated = UMM.lang.langStrings[this.lang.currentLang][id];
        }
        else if(typeof(UMM.langStrings['en']) != "undefined" && typeof(UMM.langStrings['en'][id]) !== "undefined"){
            translated = UMM.langStrings['en'][id];
        }
    
        if(! translated){
            translated = id;
        }
        return translated;
    },
    
    translatePage: function(){
        UMM.logInfo("Translating page");
        $('[data-lang]').map(function(){
            $(this).text(UMM.getString($(this).attr('data-lang')));
        });
    },
    
    // Check Internet connection
    checkConnection: function(){
    
        var connected = true;
    
        if(typeof(navigator.network) != 'undefined'){
            networkState = navigator.network.connection.type;
            connected = (networkState != Connection.NONE && networkState != Connection.UNKNOWN);
            UMM.logInfo("Internet connection checked "+connected);
        }
        else{
            UMM.logInfo("Can not check Internet connection");
        }
    
        return connected;
    },    
    
    // Custom error popup
    UMM.popErrorMessage: function (errorMessage){
         $.mobile.hidePageLoadingMsg();
         $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + errorMessage  + "</h1></div>")
         .css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
         .appendTo( $.mobile.pageContainer )
         .delay( 1100 )
         .fadeOut( 600, function(){
            $(this).remove();
         });
         UMM.logInfo("Error message:"+errorMessage);
    },
    
    popMessage: function(errorMessage){
         $.mobile.hidePageLoadingMsg();
         $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + errorMessage  + "</h1></div>")
         .css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
         .appendTo( $.mobile.pageContainer )
         .delay( 1100 )
         .fadeOut( 600, function(){
            $(this).remove();
         });
     },
    
     // A wrapper function for a moodle WebService call
    moodleWSCall: function(method, data, callBack, preSets){
    
        UMM.logInfo("WS Call "+method);
    
        // TODO handle 2.2 with native JSON support
        return UMM.moodleWSCallXML(method, data, callBack, preSets);
    
    },
    
    // Function for uploading files to Moodle
    moodleUploadFile: function(data, fileOptions, successCallBack, errorCallBack){
        UMM.logInfo("Trying to upload file ("+data.length+" chars)");
        $.mobile.showPageLoadingMsg();
        // uggly hack for changing the message
        $('.ui-loader h1').text('Uploading');
    
        var tokens = localStorage.getItem("tokens");
        var tokens = JSON.parse(tokens);
        var mytoken = tokens[localStorage.getItem("current_site")];
        if(!mytoken){
            UMM.popErrorMessage('Unexpected error (token not found). Please close and open again the application');
            return false;
        }
    
        var sites = JSON.parse(localStorage.getItem("sites"));
        var siteurl = sites[localStorage.getItem("current_site")].siteurl;
        if(!siteurl){
            UMM.popErrorMessage('Unexpected error (site not found). Please close and open again the application');
            return false;
        }
    
        UMM.logInfo("Initilizating uploader");
        var options = new FileUploadOptions();
        options.fileKey = fileOptions.fileKey;
        options.fileName = fileOptions.fileName;
        options.mimeType = fileOptions.mimeType;
    
        var params = new Object();
        params.token = mytoken;
    
        options.params = params;
    
        UMM.logInfo("Uploading");
        var ft = new FileTransfer();
        ft.upload(data, siteurl+"/webservice/upload.php",
                  function(){
                                $.mobile.hidePageLoadingMsg();
                                successCallBack();
                            },
                  function(){
                                errorCallBack();
                            },
                  options);
    
    
    },
    
    UMM.setCachedWSCall: function(ajaxURL, ajaxData, data){
        UMM.logInfo("Setting cache for this WS call");
        // Key in the database is md5 of url + data in jso nformat
        var key = hex_md5(ajaxURL+JSON.stringify(ajaxData));
    
        var d = new Date();
        var dataCache = {data: data, expiration: d.getTime() + cacheExpirationTime};
    
        pushCacheElements(key, dataCache);
        return false;
    },
    
    getCachedWSCall: function(ajaxURL, ajaxData){
        var key = hex_md5(ajaxURL+JSON.stringify(ajaxData));
        var cache = getCacheElements(key);
    
        var d = new Date();
        var validCache = false;
    
        validCache = typeof(cache.data) != 'undefined' && cache.data.length != 0 && d.getTime() < cache.expiration;
    
        // If the mobile is not connected, cache expiration is not checked
        if(!validCache && !connectionOn){
            validCache = typeof(cache.data) != 'undefined' && cache.data.length != 0;
        }
    
        if(! validCache){
            UMM.logInfo("No data cached or cache expired for this WS call");
            return false;
        }
        else{
            var expires = (cache.expiration - d.getTime()) / 1000;
            UMM.logInfo("WS call not fired. Data retrieved from cache (expires in "+expires+" secs)");
            return cache.data;
        }
    },
    
    // Push in the cache the data data for the element type type
    pushCacheElements: function(type,data){
        var site = localStorage.getItem("current_site");
        type = "cache_"+type+"_"+site;
        localStorage.setItem(type,JSON.stringify(data));
        UMM.logInfo("Element added to cache "+type);
    },
    
    getCacheElements: function(type){
        UMM.logInfo("Element obtained from cache "+type);
        var site = localStorage.getItem("current_site");
        type = "cache_"+type+"_"+site;
        var current_elements = localStorage.getItem(type);
        if(!current_elements){
            return [];
        }
        return JSON.parse(current_elements);
    },
    
    
     // A wrapper function for a moodle WebService call
    moodleWSCallXML: function(method, data, callBack, preSets){
    
        $.mobile.showPageLoadingMsg();
    
        if(typeof(preSets.wstoken) == 'undefined'){
            var tokens = localStorage.getItem("tokens");
            var tokens = JSON.parse(tokens);
            var mytoken = tokens[localStorage.getItem("current_site")];
            if(!mytoken){
                UMM.popErrorMessage('Unexpected error. Please close and open again the application');
                return false;
            }
        }
        else{
            var mytoken = preSets.wstoken;
        }
    
        if(typeof(preSets.siteurl) == 'undefined'){
            var sites = JSON.parse(localStorage.getItem("sites"));
            var siteurl = sites[localStorage.getItem("current_site")].siteurl;
            if(!siteurl){
                UMM.popErrorMessage('Unexpected error. Please close and open again the application');
                return false;
            }
        }
        else{
            var siteurl = preSets.siteurl;
        }
    
        // TODO . Autodected 2.2 or above to use native json mapping
        //data.moodlewsrestformat = 'json';
        data.wsfunction = method;
    
        var ajaxURL = siteurl+"/webservice/rest/server.php?wstoken="+mytoken;
        var ajaxData = data;
    
        // First of all, we check for a cached ajax response for this call
    
        preSets.nocache = (typeof(preSets.nocache) != 'undefined')? preSets.nocache : 0;
    
        if(!preSets.nocache){
            var cachedData = getCachedWSCall(ajaxURL, ajaxData);
    
            if(cachedData != false){
                $.mobile.hidePageLoadingMsg();
                callBack(cachedData);
                return true;
            }
        }
    
        // Check if we are connected to Internet
        if(! connectionOn){
            UMM.popErrorMessage("Internet connection required to perform this action");
            return;
        }
    
        $.ajax({
          type: "POST",
          url: ajaxURL,
          data: ajaxData,
          dataType: 'text',
          xhrFields: {
            withCredentials: false
          },
          dataFilter: function(data, dataType){
            // XML returned by Moodle is not well parsed
            data = data.replace(/\<VALUE\>/gi,'<VALUE><![CDATA[').replace(/\<\/VALUE\>/gi,']]></VALUE>');
            data = data.replace(/\<MESSAGE\>/gi,'<MESSAGE><![CDATA[').replace(/\<\/MESSAGE\>/gi,']]></MESSAGE>');
            return data;
          },
          success: function(data){
            $.mobile.hidePageLoadingMsg();
    
            data = xml2json(data);
    
            if(typeof(data.debuginfo) != "undefined"){
                UMM.popErrorMessage('Unexpected error. Please close and open again the application');
                return;
            }
            if(typeof(data.exception) != "undefined"){
                UMM.popErrorMessage('Error. '+data.message);
                return;
            }
    
            UMM.logInfo("Data received from WS "+typeof(data));
    
            if(typeof(data) == 'object' && typeof(data.length) != 'undefined'){
                UMM.logInfo("Data number of elements "+data.length);
            }
    
            if(!preSets.nocache){
                UMM.setCachedWSCall(ajaxURL, ajaxData, data);
            }
            callBack(data);
          }
        });
    },
    
    // Database functions
    
    insertRecord = function(table, data) {
        var records = localStorage.getItem(table);
        if (!records) {
            var id = 1;
            
            data.id = id;
            data = JSON.stringify(data);
            
            localStorage.setItem(table, { "id" + id : data})
            // First id inserted;
            return 1;
        } else {            
            // Last id inserted.
            records = JSON.parse(records);
            var id = records.length + 1;
            data = JSON.stringify(data);
            
            records["id" + id] = data;
            localStorage.setItem(table, records);
        }       
    },
    
    // Conditions, only search for id right now.
    getRecord = function(table, conditions) {
        var records = localStorage.getItem(table);
        if (!records) {
            return null;
        } else {
            records = JSON.parse(records);
            if (typeof records["id" + conditions.id] != "undefined") {
                return records["id" + conditions.id];
            } else {
                return null;
            }
        }
    },
    
    // This function is for emulating the mobile in a browser using ripple
    loadFakePhonegap: function(){
    
        if(! this.deviceReady)
            return;
    
        if(typeof(FileUploadOptions) == "undefined"){
            window.FileUploadOptions = function(){
                return {};
            }
            UMM.logInfo("Fake FileUploadOptions manager loaded");
        }
        if(typeof(FileTransfer)== "undefined"){
            window.FileTransfer = function() {};
            window.FileTransfer.prototype.upload = function(filePath, server, successCallback, errorCallback, options, debug) {
                popMessage("This is a empty function. Nothing is done because you are not using a mobile phone");
                setTimeout(successCallback,1000);
            }
            UMM.logInfo("Fake FileTransfer manager loaded");
        }
        if(typeof(navigator.contacts) == "undefined"){
            navigator.contacts = function(){
                return {};
            }
            navigator.contacts.prototype.create = function(properties) {
                return {};
            }
            navigator.contacts.prototype.create = function(successCallback, errorCallback) {
                popMessage("This is a empty function. Nothing is done because you are not using a mobile phone");
                setTimeout(successCallback,1000);
            }
            window.ContactName = function() { return {}; };
            window.ContactField = function(type, value, pref) { return {}; };
            UMM.logInfo("Fake contacts manager loaded");
        }
        if(typeof(navigator.device) == "undefined"){
            navigator.device = {};
            navigator.device.capture = {};
            navigator.device.capture.captureAudio = function(captureSuccess, captureError, options){
                popMessage("This is a empty function. Nothing is done because you are not using a mobile phone");
                setTimeout(captureError,1000);
            }
            UMM.logInfo("Fake captureAudio manager loaded");
        }    
    }
}