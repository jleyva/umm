// Basic setup for every page
// Despiste this file is included in all the pages, this is going to be included only one time in a mobile device
// This is because jqueryMobile load via AJAX the body of the pages and not the head elements

// Common settings and functions
var debugOn = false;
var debugInfo = "";
var pageReady = false;
var deviceReady = false;

$(document).bind("mobileinit", function () {
    $.mobile.defaultPageTransition = 'none';
    $.mobile.allowCrossDomainPages = true;            
    $.support.cors = true;
    logInfo("Mobile init fired");
});

$(document).ready(function() {
    pageReady = true;
    logInfo("Page ready fired");
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
    
    $(document).bind("mobileinit", function () {
        logInfo("Mobile init fired");
    });

    $(document).bind("deviceready", function(){
        deviceReady = true;
        logInfo("Device ready fired");
    });
    
    // For emulating without errors in ripple or a browser
    loadFakePhonegap();
    
    var debugVal = localStorage.getItem('debug_on');
    if(debugVal == "1"){
        debugOn = true;
    }
    
    // AJAX error handling    
    $.ajaxSetup({"error":function(XMLHttpRequest,textStatus, errorThrown) {   
        popErrorMessage("Could not connect to the Moodle site");
        logInfo("AJAX error: "+textStatus);
    }}); 
    logInfo("Page setup finished");
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

	// TODO handle when JSON enabled
    moodleWSCallXML(method, data, callBack, preSets);
	return true;
                        
    $.mobile.showPageLoadingMsg();
    
    if(typeof(preSets.wstoken) == 'undefined'){   
        var tokens = localStorage.getItem("tokens");
        var tokens = JSON.parse(tokens);
        var mytoken = tokens[localStorage.getItem("current_site")];
        if(!mytoken){
            popErrorMessage('Unexpected error (token not found). Please close and open again the application');
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
            popErrorMessage('Unexpected error (site not found). Please close and open again the application');
            return false;
        }
    }
    else{
        var siteurl = preSets.siteurl;
    }
    
	data.moodlewsrestformat = 'json';
    data.wsfunction = method;
    
    $.ajax({
      type: "POST",
      url: siteurl+"/webservice/rest/server.php?wstoken="+mytoken,
      data: data,
      dataType: 'json',  
      success: function(data){
        $.mobile.hidePageLoadingMsg();
        if(typeof(data.debuginfo) != "undefined"){
            popErrorMessage('Unexpected error. Please close and open again the application');
            return;
        }
        if(typeof(data.exception) != "undefined"){
            popErrorMessage('Error. '+data.message);
            return;
        }
        callBack(data);
      }
    });    
}

// Function for uploading files to Moodle
function moodleUploadFile(data){
    logInfo("Trying to upload file ("+data.length+" chars)");
    $.mobile.showPageLoadingMsg();
    // uggly hack for changing the message
    $('.ui-loader h1').text('Uploading image');
    
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
    
    var d = new Date();
    
    logInfo("Initilizating uploader");
    var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName="image_"+d.getTime()+".jpg";
	options.mimeType="image/jpeg";
 
	var params = new Object();
	params.token = mytoken;
    
	options.params = params;
    
    logInfo("Uploading");
    var ft = new FileTransfer();
    ft.upload(data, siteurl+"/webservice/upload.php",
              function(){
                            $.mobile.hidePageLoadingMsg();
                            popMessage("File uploaded");
                        },
              function(){ popErrorMessage('Upload fail');},
              options);

          
}

// Push in the cache the data data for the element type type
function pushCacheElements(type,data){
    var site = localStorage.getItem("current_site");
    type += "_"+site;
    localStorage.setItem(type,JSON.stringify(data));
    logInfo("Element added to cache "+type);
}

function getCacheElements(type){
    logInfo("Element obtained from cache "+type);
    var site = localStorage.getItem("current_site");
    type += "_"+site;
    var current_elements = localStorage.getItem(type);
    if(!current_elements){
        return [];
    }    
    return JSON.parse(current_elements);
}



// Experimental XML support


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
    
    $.ajax({
      type: "POST",
      url: siteurl+"/webservice/rest/server.php?wstoken="+mytoken,
      data: data,
	  dataType: 'text',
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
        
        callBack(data);
      }
    });    
}

// This function is for emulating the mobile in a browser
function loadFakePhonegap(){
    if(typeof(FileUploadOptions) == "undefined"){
        window.FileUploadOptions = function(){
            return {};
        }
    }
    if(typeof(FileTransfer)== "undefined"){
        window.FileTransfer = function() {};
        window.FileTransfer.prototype.upload = function(filePath, server, successCallback, errorCallback, options, debug) {
            popMessage("This is a empty function. Nothing is done because you are not using a mobile phone");
            setTimeout(successCallback,1000);
        }
    }
}

function moodleJSONProcessSingle(node){
	var singlenode = {};
	
	for(var i in node.key){
		var newnode = node.key[i];
		if(typeof(newnode) == 'object'){
			if(typeof(newnode.value) != 'undefined' )
				singlenode[newnode.name] = newnode.value;
			else
				singlenode[newnode.name] = moodleJSONPrettifier(newnode);			
		}
	}
	return singlenode;
}

function moodleJSONPrettifier(json){
	if(typeof(json.multiple) != 'undefined'){
		var newjson = [];
		
		for(var i in json.multiple.single){
			if(typeof(json.multiple.single[i]) == 'object'){
				newjson.push(moodleJSONProcessSingle(json.multiple.single[i]));
			}
		}
		return newjson;
	}
	else{
		return moodleJSONProcessSingle(json);
	}
}