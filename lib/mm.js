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

var MM = {
    
    cfg: {},
    
    mod: {},
    
    debugOn: false,
    
    debugInfo: "",
    
    pageReady: false,
    
    deviceReady: false,
    
    connectionOn: false,
    
    lang: {        
        languages: {"es": "Español", "en": "English", "ca" : "Catalá", "fr" : "Français", "ru" : "русский язык"},
        currentLang: this.defaultLang,
        // Cache for lang strings.
        langStrings: []
    },
    
   
    // Functions.
    
    // This function is called the first time the app is started.    
    init: function(wwwroot) {
        
        // Loadding settings.
        
        // Detect www root.
        if (typeof wwwroot == "undefined") {
            MM.cfg.wwwroot = location.href.replace("/index.html","");
        } else {
            MM.cfg.wwwroot = wwwroot;
        }
        
        // First load the config.json settings.
        MM.loadConfig();
        
        // Load theme CSS. Sync blocking call.
        var css = ["jquery.mobile.css", "MM.css"];
        for (var el in css) {            
            $.ajax({
                url: MM.cfg.wwwroot + "/theme/" + MM.cfg.theme + "/" + css[el],
                async: false,
                success:function(data){
                     // Fix correct path in CSS (mm).
                     data = data.replace(/pix\//g, MM.cfg.wwwroot + "/theme/" + MM.cfg.theme + "pix/")
                     // Fix correct path in CSS (jquery).
                     data = data.replace(/images\//g, MM.cfg.wwwroot + "/theme/" + MM.cfg.theme + "/pix/j/")
                     $("<style></style>").appendTo("head").html(data);
                }
            })
        }
        
        MM.loadLang(MM.cfg.lang);
    
        $(document).bind("mobileinit", function () {
            $.mobile.allowCrossDomainPages = true;
            $.support.cors = true;
        
            // Enable or disable page transitions (visual effect)
            var transitionsOn = localStorage.getItem('transitions_on');
            if (transitionsOn != "1") {
                $.mobile.defaultPageTransition = 'none';
            }
        
            MM.logInfo("Mobile init fired");
        });
        
        $(document).ready(function() {
            this.pageReady = true;
            MM.logInfo("Page ready fired");
        });
        
        $(document).bind("this.deviceReady", function(){
            this.deviceReady = true;
            MM.logInfo("Device ready fired");
        });
        
        if (typeof(console) == "undefined") {
            // For Windows Phone 7.x.
            window.console = { log: function (str) { window.external.Notify(str); } };
            // Output any errors to console log, created above.
            window.onerror = function (msg,url,linenumber) {
              console.log("mm: " + msg + " in " + url + " at line " + linenumber);
            };
        }
    },

    authIndex: function() {        
        return this.cfg.wwwroot + "/auth/" + this.cfg.auth + "/index.html";
    },

    logInfo: function(info){
        if(this.debugOn){
    
            info = "mm: "+info;
    
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

        // Cleaning old debug info
        $(".debuginfo").remove();
    
        // Handling mobile init
        $(document).bind("mobileinit", function () {
            MM.logInfo("Mobile init fired");
        });
    
        // For emulating without errors in ripple or a browser
        this.loadFakePhonegap();

        // Loading page settings
        var debugVal = this.getConfig('mm', 'debug_on');
        if(debugVal == "1"){
            this.debugOn = true;
        }
    
        this.connectionOn = this.checkConnection();
    
        if(! this.connectionOn){
            MM.logInfo("Mobile is not connected to Internet");
        }
    
        // AJAX error handling
        $.ajaxSetup({"error":function(XMLHttpRequest,textStatus, errorThrown) {
            MM.popErrorMessage("Could not connect to the Moodle site");
            MM.logInfo("AJAX error: "+textStatus);
        }});
    
        // Localization
        MM.lang.currentLang = this.getConfig('mm','current_lang');
        if(MM.lang.currentLang === null){
            MM.lang.currentLang = MM.cfg.lang;
        }
        
        MM.loadLang(MM.lang.currentLang, MM.translatePage);
    
        MM.logInfo("Page setup finished");
    },
    
    /**
     * Load config defaults (config.json) and custom configs (config.custom.json)
     * First we load the config defaults, then the custom build configs that can overwrite defaults
     * Database stored settings is loaded after .json files and do not overwrite defaults
     */
    loadConfig: function() {
        var configFiles = ["config.json", "config.custom.json"];
        for (var i in configFiles) {
            $.ajax({
              type: "GET",
              url: MM.cfg.wwwroot+ "/" + configFiles[i],
              dataType: 'json',
              async: false,
              success: function(data){
                // JSON response is an object, back to array.
                // TODO, Improve this using MM.cfg = $.makeArray(data); or similar:
                for (var el in data) {
                    MM.cfg[el] = data[el];
                }
              }
            });
        }

        // Then load the database settings.
        var configs = this.getConfig('mm');

        for (var el in configs) {
            var config = configs[el];
            MM.cfg[config.name] = config.value;
        }
    },
    
    getConfig: function(plugin, name) {
        if (typeof name == "undefined") {            
            return MM.getRecords("config", {plugin: plugin});
        } else {            
            var config = MM.getRecord("config", {name: name, plugin: plugin});
            if (config) {
                return config.value;
            }
        }
        return null;
    },
    
    setConfig: function(name, value, plugin) {
        
        if (typeof plugin == "undefined") {
            plugin = "mm";
        }
        
        var config = MM.getRecord("config", {name: name, plugin: plugin});
        if(config) {
            config.value = value;
            MM.updateRecord("config", config);
        } else {
            var config = {
                name: name,
                value: value,
                plugin: plugin
            };
            MM.insertRecord("config", config);
        }
        
        // Update the main config object.
        if (plugin == "mm") {
            MM.cfg[name] = value;
        }
    },
    
    loadLang: function(lang, callback) {

        if (typeof callback == "undefined") {
            callback = function() { return; };
        }
        
        if (typeof(MM.lang.langStrings[lang]) != 'undefined'){
            callback();
            return;
        }

        $.ajax({
          type: "GET",
          url: MM.cfg.wwwroot + "/lang/"+lang+".json",
          dataType: 'json',
          success: function(data){
            MM.lang.langStrings[lang] = data;
            callback();
          }
        });
    },

    getString: function(id){
        var translated = '';
        if(typeof(MM.lang.langStrings[this.lang.currentLang][id]) !== "undefined"){
            translated = MM.lang.langStrings[this.lang.currentLang][id];
        }
        else if(typeof(MM.langStrings['en']) != "undefined" && typeof(MM.langStrings['en'][id]) !== "undefined"){
            translated = MM.langStrings['en'][id];
        }
    
        if(! translated){
            translated = id;
        }
        return translated;
    },
    
    translatePage: function(){
        MM.logInfo("Translating page");
        $('[data-lang]').each(function(){
            $(this).text(MM.getString($(this).attr('data-lang')));
        });
    },
    
    // Check Internet connection
    checkConnection: function(){
    
        var connected = true;
    
        if(typeof(navigator.network) != 'undefined'){
            networkState = navigator.network.connection.type;
            connected = (networkState != Connection.NONE && networkState != Connection.UNKNOWN);
            MM.logInfo("Internet connection checked "+connected);
        }
        else{
            MM.logInfo("Can not check Internet connection");
        }
    
        return connected;
    },    
    
    // Custom error popup
    popErrorMessage: function (errorMessage){
         $.mobile.hidePageLoadingMsg();
         $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + errorMessage  + "</h1></div>")
         .css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
         .appendTo( $.mobile.pageContainer )
         .delay( 1100 )
         .fadeOut( 600, function(){
            $(this).remove();
         });
         MM.logInfo("Error message:"+errorMessage);
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
    
        MM.logInfo("WS Call "+method);
    
        // TODO handle 2.2 with native JSON support
        return MM.moodleWSCallXML(method, data, callBack, preSets);
    
    },
    
    // Function for uploading files to Moodle
    moodleUploadFile: function(data, fileOptions, successCallBack, errorCallBack){
        MM.logInfo("Trying to upload file ("+data.length+" chars)");
        $.mobile.showPageLoadingMsg();
        // uggly hack for changing the message
        $('.ui-loader h1').text('Uploading');
    
        var tokens = localStorage.getItem("tokens");
        var tokens = JSON.parse(tokens);
        var mytoken = tokens[MM.cfg.current_site];
        if(!mytoken){
            MM.popErrorMessage('Unexpected error (token not found). Please close and open again the application');
            return false;
        }
    
        var sites = JSON.parse(localStorage.getItem("sites"));
        var siteurl = sites[MM.cfg.current_site].siteurl;
        if(!siteurl){
            MM.popErrorMessage('Unexpected error (site not found). Please close and open again the application');
            return false;
        }
    
        MM.logInfo("Initilizating uploader");
        var options = new FileUploadOptions();
        options.fileKey = fileOptions.fileKey;
        options.fileName = fileOptions.fileName;
        options.mimeType = fileOptions.mimeType;
    
        var params = new Object();
        params.token = mytoken;
    
        options.params = params;
    
        MM.logInfo("Uploading");
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
    
    setCachedWSCall: function(ajaxURL, ajaxData, data){
        MM.logInfo("Setting cache for this WS call");
        // Key in the database is md5 of url + data in jso nformat
        var key = hex_md5(ajaxURL+JSON.stringify(ajaxData));
    
        var d = new Date();
        var dataCache = {data: data, expiration: d.getTime() + MM.cfg.cache_time};
    
        MM.pushCacheElements(key, dataCache);
        return false;
    },
    
    getCachedWSCall: function(ajaxURL, ajaxData){
        var key = hex_md5(ajaxURL+JSON.stringify(ajaxData));
        var cache = MM.getCacheElements(key);
    
        var d = new Date();
        var validCache = false;
    
        validCache = typeof(cache.data) != 'undefined' && cache.data.length != 0 && d.getTime() < cache.expiration;
    
        // If the mobile is not connected, cache expiration is not checked
        if(!validCache && !MM.connectionOn){
            validCache = typeof(cache.data) != 'undefined' && cache.data.length != 0;
        }
    
        if(! validCache){
            MM.logInfo("No data cached or cache expired for this WS call");
            return false;
        }
        else{
            var expires = (cache.expiration - d.getTime()) / 1000;
            MM.logInfo("WS call not fired. Data retrieved from cache (expires in "+expires+" secs)");
            return cache.data;
        }
    },
    
    // Push in the cache the data data for the element key
    pushCacheElements: function(key, data){
        var site = MM.cfg.current_site;
        key = "zcache_" + key + "_" + site;
        localStorage.setItem(key, JSON.stringify(data));
        MM.logInfo("Element added to cache " + key);
    },
    
    getCacheElements: function(key){
        MM.logInfo("Element obtained from cache "+key);
        var site = MM.cfg.current_site;
        key = "zcache_"+key+"_"+site;
        var current_elements = localStorage.getItem(key);
        if(!current_elements){
            return [];
        }
        return JSON.parse(current_elements);
    },
    
    requiredParam: function(name){
        var params = sessionStorage.getItem("session_params");
        if (params) {
            params = JSON.parse(params);
            if (typeof params[name] != "undefined") {
                return params[name];
            }
        }
        MM.popErrorMessage("Unexpected error, missing param.");
    },
    
    setParams: function(params) {
        sessionStorage.setItem("session_params", JSON.stringify(params));
    },
    
     // A wrapper function for a moodle WebService call
    moodleWSCallXML: function(method, data, callBack, preSets){
    
        $.mobile.showPageLoadingMsg();
        
        if (typeof(preSets) == 'undefined') {
            preSets = {};
        }
        
        if(typeof(preSets.wstoken) == 'undefined'){
            var mytoken = MM.cfg.current_token;
            if(!mytoken){
                MM.popErrorMessage('Unexpected error. Please close and open again the application');
                return false;
            }
        }
        else{
            var mytoken = preSets.wstoken;
        }
    
        if(typeof(preSets.siteurl) == 'undefined'){
            var site = MM.getRecord('sites', {id: MM.cfg.current_site});
            var siteurl = site.siteurl;
            if(!siteurl){
                MM.popErrorMessage('Unexpected error. Please close and open again the application');
                return false;
            }
        }
        else{
            var siteurl = preSets.siteurl;
        }
    
        // TODO . Autodected 2.2 or above to use native json mapping
        //data.moodlewsrestformat = 'json';
        data.wsfunction = method;
    
        var ajaxURL = siteurl+"/webservice/rest/server.php?wstoken=" + mytoken;
        var ajaxData = data;
    
        // First of all, we check for a cached ajax response for this call.
    
        preSets.nocache = (typeof(preSets.nocache) != 'undefined')? preSets.nocache : 0;
    
        if (!preSets.nocache){
            var cachedData = MM.getCachedWSCall(ajaxURL, ajaxData);
    
            if(cachedData != false){
                $.mobile.hidePageLoadingMsg();
                callBack(cachedData);
                return true;
            }
        }
    
        // Check if we are connected to Internet
        if (! MM.connectionOn){
            MM.popErrorMessage("Internet connection required to perform this action");
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
                MM.popErrorMessage('Unexpected error. Please close and open again the application');
                return;
            }
            if(typeof(data.exception) != "undefined"){
                MM.popErrorMessage('Error. '+data.message);
                return;
            }
    
            MM.logInfo("Data received from WS "+typeof(data));
    
            if(typeof(data) == 'object' && typeof(data.length) != 'undefined'){
                MM.logInfo("Data number of elements "+data.length);
            }
    
            if(!preSets.nocache){
                MM.setCachedWSCall(ajaxURL, ajaxData, data);
            }
            callBack(data);
          }
        });
    },
    
    // Database functions
    
    insertRecord: function(table, data) {
        var records = localStorage.getItem(table);
        var id = 0;
        
        if (!records) {
            id = 1;
            
            data.id = id;
            data = JSON.stringify(data);
            
            records = {};
            records["id" + id] = data;
        } else {            
            // Last id inserted.
            records = JSON.parse(records);
            
            var length = 0;
            for(var i in records) {
                if (records.hasOwnProperty(i)) {
                    length++;
                }
            }
            
            id = length + 1;
            data.id = id;
            data = JSON.stringify(data);
            
            records["id" + id] = data;
        }
        localStorage.setItem(table, JSON.stringify(records));
        return id;
    },
    
    updateRecord: function (table, data) {
        if (typeof data.id != "undefined") {
            var records = localStorage.getItem(table);
            if (records) {
                records = JSON.parse(records);
                if (typeof records["id" + data.id] != "undefined") {
                    records["id" + data.id] = data;
                    localStorage.setItem(table, JSON.stringify(records));
                    return true;
                }
            }
        }
        return false;
    },
    
    getRecord: function(table, conditions) {
        var records = MM.getRecords(table, conditions);
        if (records) {
            // We return the first element.
            for (var el in records) {
                return records[el]
            }
        }
        return null;
    },
    
    getRecords: function(table, conditions) {
        var records = localStorage.getItem(table);
        var result = {};
        
        if (records) {            
            records = JSON.parse(records);
            // Special case, search by id.
            if (conditions.length == 1 && typeof conditions.id != "undefined") {
                if (typeof records["id" + conditions.id] != "undefined") {
                    result["id" + conditions.id] = records["id" + conditions.id];
                }
            } else {
                // More than one condition.                
                for (var elr in records) {
                    var found = true;
                    var record = JSON.parse(records[elr]);
                    for (var field in record){                        
                        for (var condition in conditions) {
                            // Do some casting.                        
                            if (record[condition] != conditions[condition]) {
                                found = false;                            
                            }
                        }
                    }
                    if (found) {
                        console.log(record);
                        result["id" + record.id] = record;
                    }
                }
            }
            return result;
        }
        return null;
    },
    
    completeUserLogin: function (site, token) {
        var siteId = MM.insertRecord('sites', site);
        MM.insertRecord('tokens', {token: token, siteid: siteId});

        MM.setConfig('current_userid', site.userid);
        MM.setConfig('current_site', siteId);
        MM.setConfig('current_siteurl', site.siteurl);
        MM.setConfig('current_token', token);
    },
    
    loadModule: function (module) {
        if (typeof MM.mod[module] == "undefined") {
            // We must for sync calls
            $.ajaxSetup({async: false});
            $.getScript(MM.cfg.wwwroot + "/mod/" + module + "/lib.js", function() {
                    MM.mod[module].init();
                });
            $.ajaxSetup({async: true});
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
            MM.logInfo("Fake FileUploadOptions manager loaded");
        }
        if(typeof(FileTransfer)== "undefined"){
            window.FileTransfer = function() {};
            window.FileTransfer.prototype.upload = function(filePath, server, successCallback, errorCallback, options, debug) {
                popMessage("This is a empty function. Nothing is done because you are not using a mobile phone");
                setTimeout(successCallback,1000);
            }
            MM.logInfo("Fake FileTransfer manager loaded");
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
            MM.logInfo("Fake contacts manager loaded");
        }
        if(typeof(navigator.device) == "undefined"){
            navigator.device = {};
            navigator.device.capture = {};
            navigator.device.capture.captureAudio = function(captureSuccess, captureError, options){
                popMessage("This is a empty function. Nothing is done because you are not using a mobile phone");
                setTimeout(captureError,1000);
            }
            MM.logInfo("Fake captureAudio manager loaded");
        }    
    }
}