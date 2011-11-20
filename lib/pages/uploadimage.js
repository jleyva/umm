(function() {

    
        $("#bupload").click(function(){
            
        });

        var onSuccess = function(uri) {           
            $('#camera-image').css({
                'background-image': 'url('+uri+')',
                'background-size':  '100%'
            });
            
        };

        var onFail = function() {
            popErrorMessage('Failed to get an image');
        };

        $("#page-uploadimage").live('pageshow',function() {
            // We are emulating over Ripple
            // This is a fake return of the Phonegap API for testing pourpuses
            if(typeof(navigator) == 'undefined' || typeof(navigator.camera) == 'undefined' ||  typeof(navigator.camera.PictureSourceType) == 'undefined'){
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
            
            var action = sessionStorage.getItem('upload_action');
            
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
        });    
})();