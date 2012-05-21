/**
 * Script for debugging not /index.html urls directly in the browser
 * jqueryMobile only load the javascript of the first page you visit
 * For debugging additional pages this script helps to load all the necessary javascript dependencies
 */

var wwwroot = $("#debugscript").attr('data-wwwpath');
var baseDir = wwwroot + "/lib/";

// We must for sync calls.
$.ajaxSetup({async: false});
$.getScript(baseDir + "/xml2json.js", function() {
    $.getScript(baseDir + "/md5.js", function(){
        $.getScript(baseDir + "/umm.js", function(){
            UMM.init(wwwroot);
            $.getScript(baseDir + "/jquery.mobile.js");
          });
      });  
  });
$.ajaxSetup({async: true});
