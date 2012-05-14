setupPage();

var imageURI;

$("#bupload").click(function(){
    var d = new Date();
    
    var options = {};
    options.fileKey="file";
    options.fileName="image_"+d.getTime()+".jpg";
    options.mimeType="image/jpeg";
    
    moodleUploadFile(imageURI, options, function(){ popMessage("File uploaded"); }, function(){ popErrorMessage('Upload failed'); });       
});

var onSuccess = function(uri) {           
    $('#camera-image').css({
        'background-image': 'url('+uri+')',
        'background-size':  '100%'
    });
    imageURI = uri;
    logInfo("Image loaded");
};

var onFail = function() {
    popErrorMessage('Failed to get an image');
};

function handleAction(){
    
    if(navigator.camera){
        var action = localStorage.getItem('upload_action');
        
        logInfo("Processing image "+action);
        
        if(action == 'takephoto'){
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI
            });
        }
        else{
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            });
        }
    }
}

    
(function() {

        $("#page-uploadimage").live('pageshow',function() {
            
            logInfo("Page show fired");
            
            // We are emulating over Ripple
            // This is a fake return of the Phonegap API for testing pourpuses
            if(typeof(navigator) == 'undefined' || typeof(navigator.camera) == 'undefined' ||  typeof(navigator.camera.PictureSourceType) == 'undefined'){
                    logInfo("Emulating phone, not using a real device");
                    
                    window.navigator = {
                        camera: {
                            getPicture: function(onSuccess, onFail, options) {
                                onSuccess('lib/debug/image.png');
                            },
                            PictureSourceType: {
                                PHOTOLIBRARY: 0
                            },
                            DestinationType: {
                                FILE_URI: 0
                            }
                        }
                    };
            }
            
            logInfo("Waiting for cammera");
            setTimeout('handleAction()',500);
            
        });    
})();