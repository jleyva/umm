// Basic setup for every page
// Despiste this file is included in all the pages, this is going to be included only one time in a mobile device
// This is because jqueryMobile load via AJAX the body of the pages and not the head elements

// Common settings and functions
var debugOn = false;
var debugInfo = "";
var pageReady = false;
var deviceReady = false;
var cacheExpirationTime = 300000;    // milliseconds
var connectionOn = false;

$(document).bind("mobileinit", function () {    
    $.mobile.allowCrossDomainPages = true;            
    $.support.cors = true;
    
    // Enable or disable page transitions (visual effect)
    var transitionsOn = localStorage.getItem('transitions_on');
    if(transitionsOn != "1"){
        $.mobile.defaultPageTransition = 'none';
    }
    
    logInfo("Mobile init fired");
});

$(document).ready(function() {
    pageReady = true;
    logInfo("Page ready fired");
});

$(document).bind("deviceready", function(){
    deviceReady = true;
    logInfo("Device ready fired");
});


function logInfo(info){
    if(debugOn){
        
        info = "umm: "+info;
        
        if (typeof(console) != "undefined") {
            console.log(info);
        }
        
        // Checking if we can append in somewhere
        if(pageReady && $("div[data-role='content']").length){                        
            $("div[data-role='content']").append(debugInfo+'<span class="debuginfo">'+info+"<br /></span>");
            debugInfo = "";
        }
        else{
            debugInfo += '<span class="debuginfo">'+info+"<br /></span>";
        }
    }
}

// Common setup for pages
function setupPage(){
    // Cleaning old debug info
    $(".debuginfo").remove();
    
    // Handling mobile init
    $(document).bind("mobileinit", function () {
        logInfo("Mobile init fired");
    });
       
    // For emulating without errors in ripple or a browser
    loadFakePhonegap();
    
    // Loading page settings
    var debugVal = localStorage.getItem('debug_on');
    if(debugVal == "1"){
        debugOn = true;
    }
    
    var cacheTimeVal = localStorage.getItem('cache_time');
    if(cacheTimeVal !== null){
        cacheExpirationTime = parseInt(cacheTimeVal);
    }    
    
    connectionOn = checkConnection();
    
    if(! connectionOn){
        logInfo("Mobile is not connected to Internet");
    }
    
    // AJAX error handling    
    $.ajaxSetup({"error":function(XMLHttpRequest,textStatus, errorThrown) {   
        popErrorMessage("Could not connect to the Moodle site");
        logInfo("AJAX error: "+textStatus);
    }}); 
    logInfo("Page setup finished");
}

// Check Internet connection
function checkConnection(){
    
    var connected = true;
    
    if(typeof(navigator.network) != 'undefined'){
        networkState = navigator.network.connection.type;
        connected = (networkState != Connection.NONE && networkState != Connection.UNKNOWN);
        logInfo("Internet connection checked "+connected);
    }
    else{
        logInfo("Can not check Internet connection");
    }
    
    return connected;
}


// Custom error popup
function popErrorMessage(errorMessage){
     $.mobile.hidePageLoadingMsg();
     $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + errorMessage  + "</h1></div>")
     .css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
     .appendTo( $.mobile.pageContainer )
     .delay( 1100 )
     .fadeOut( 600, function(){
        $(this).remove();
     });
     logInfo("Error message:"+errorMessage);
}
 
function popMessage(errorMessage){
     $.mobile.hidePageLoadingMsg();
     $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + errorMessage  + "</h1></div>")
     .css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
     .appendTo( $.mobile.pageContainer )
     .delay( 1100 )
     .fadeOut( 600, function(){
        $(this).remove();
     }); 
 }

 // A wrapper function for a moodle WebService call
function moodleWSCall(method, data, callBack, preSets){
    
    logInfo("WS Call "+method);

    // TODO handle 2.2 with native JSON support
    return moodleWSCallXML(method, data, callBack, preSets);
    
}

// Function for uploading files to Moodle
function moodleUploadFile(data, fileOptions, successCallBack, errorCallBack){
    logInfo("Trying to upload file ("+data.length+" chars)");
    $.mobile.showPageLoadingMsg();
    // uggly hack for changing the message
    $('.ui-loader h1').text('Uploading');
    
    var tokens = localStorage.getItem("tokens");
    var tokens = JSON.parse(tokens);
    var mytoken = tokens[localStorage.getItem("current_site")];
    if(!mytoken){
        popErrorMessage('Unexpected error (token not found). Please close and open again the application');
        return false;
    }
    
    var sites = JSON.parse(localStorage.getItem("sites"));
    var siteurl = sites[localStorage.getItem("current_site")].siteurl;
    if(!siteurl){
        popErrorMessage('Unexpected error (site not found). Please close and open again the application');
        return false;
    }   
    
    logInfo("Initilizating uploader");
    var options = new FileUploadOptions();
    options.fileKey = fileOptions.fileKey;
    options.fileName = fileOptions.fileName;
    options.mimeType = fileOptions.mimeType;
 
    var params = new Object();
    params.token = mytoken;
    
    options.params = params;
    
    logInfo("Uploading");
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

          
}

function setCachedWSCall(ajaxURL, ajaxData, data){
    logInfo("Setting cache for this WS call");
    // Key in the database is md5 of url + data in jso nformat
    var key = hex_md5(ajaxURL+JSON.stringify(ajaxData));
    
    var d = new Date();
    var dataCache = {data: data, expiration: d.getTime() + cacheExpirationTime};
    
    pushCacheElements(key, dataCache);
    return false;    
}

function getCachedWSCall(ajaxURL, ajaxData){
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
        logInfo("No data cached or cache expired for this WS call");
        return false;    
    }
    else{
        var expires = (cache.expiration - d.getTime()) / 1000;
        logInfo("WS call not fired. Data retrieved from cache (expires in "+expires+" secs)");
        return cache.data;    
    }
}

// Push in the cache the data data for the element type type
function pushCacheElements(type,data){
    var site = localStorage.getItem("current_site");
    type = "cache_"+type+"_"+site;
    localStorage.setItem(type,JSON.stringify(data));
    logInfo("Element added to cache "+type);
}

function getCacheElements(type){
    logInfo("Element obtained from cache "+type);
    var site = localStorage.getItem("current_site");
    type = "cache_"+type+"_"+site;
    var current_elements = localStorage.getItem(type);
    if(!current_elements){
        return [];
    }    
    return JSON.parse(current_elements);
}


 // A wrapper function for a moodle WebService call
function moodleWSCallXML(method, data, callBack, preSets){
                        
    $.mobile.showPageLoadingMsg();
    
    if(typeof(preSets.wstoken) == 'undefined'){   
        var tokens = localStorage.getItem("tokens");
        var tokens = JSON.parse(tokens);
        var mytoken = tokens[localStorage.getItem("current_site")];
        if(!mytoken){
            popErrorMessage('Unexpected error. Please close and open again the application');
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
            popErrorMessage('Unexpected error. Please close and open again the application');
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
        popErrorMessage("Internet connection required to perform this action");
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
            popErrorMessage('Unexpected error. Please close and open again the application');
            return;
        }
        if(typeof(data.exception) != "undefined"){
            popErrorMessage('Error. '+data.message);
            return;
        }
        
        logInfo("Data received from WS "+typeof(data));       
        
        if(typeof(data) == 'object' && typeof(data.length) != 'undefined'){
            logInfo("Data number of elements "+data.length);
        }
        
        if(!preSets.nocache){
            setCachedWSCall(ajaxURL, ajaxData, data);
        }
        callBack(data);
      }
    });    
}

// This function is for emulating the mobile in a browser using ripple
function loadFakePhonegap(){
    
    if(! deviceReady)
        return;

    if(typeof(FileUploadOptions) == "undefined"){
        window.FileUploadOptions = function(){
            return {};
        }
        logInfo("Fake FileUploadOptions manager loaded");
    }
    if(typeof(FileTransfer)== "undefined"){
        window.FileTransfer = function() {};
        window.FileTransfer.prototype.upload = function(filePath, server, successCallback, errorCallback, options, debug) {
            popMessage("This is a empty function. Nothing is done because you are not using a mobile phone");
            setTimeout(successCallback,1000);
        }
        logInfo("Fake FileTransfer manager loaded");
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
        logInfo("Fake contacts manager loaded");
    }
    if(typeof(navigator.device) == "undefined"){
        navigator.device = {};
        navigator.device.capture = {};
        navigator.device.capture.captureAudio = function(captureSuccess, captureError, options){
            popMessage("This is a empty function. Nothing is done because you are not using a mobile phone");
            setTimeout(captureError,1000);
        }
        logInfo("Fake captureAudio manager loaded");
    }
    
}
