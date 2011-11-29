(function() {
    
    setupPage();

    $("#btake").click(function(){
        localStorage.setItem('upload_action','takephoto');
        $.mobile.changePage("uploadimage.html");
    });
    
    $("#bbrowse").click(function(){
        localStorage.setItem('upload_action','browsephoto');
        $.mobile.changePage("uploadimage.html");
    });
    
    // Record audio
    
    function captureSuccess(mediaFiles) {
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            var options = {};
            options.fileKey = null;
            options.fileName = mediaFiles[i].name;
            options.mimeType = null;
            
            moodleUploadFile(mediaFiles[i].fullPath, options, function(){ popMessage("File uploaded"); }, function(){ popErrorMessage('Upload failed'); }); 
        }       
    }
 
    function captureError(error) {
        popErrorMessage('Audio recording failed');
    }
    
    $("#brecord").click(function(){
        logInfo("Trying to capture audio");
        navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 1});
    });

})();