(function() {

    window.navigator = {
        accelerometer: {
            clearWatch: function(watchId) {
                clearTimeout(watchId);
            },
            watchAcceleration: function(onSuccess, onFail, options) {
                var watchId = setInterval(function() {
                    onSuccess({
                        x: Math.random(),
                        y: Math.random(),
                        z: Math.random()
                    });
                }, options.frequency);

                return watchId;
            }
        },

        camera: {
            getPicture: function(onSuccess, onFail, options) {
                onSuccess('hello/world/image.png');
            },
            PictureSourceType: {
                PHOTOLIBRARY: 0
            },
            DestinationType: {
                FILE_URI: 0
            }
        },

        network: {
            isReachable: function(domain, callback) {
                callback(1);
            }
        },

        notification: {
            alert: function(message, onSuccess) {
                alert(message);
                onSuccess();
            },
            beep: function(times) {
                console.log('Beep x' + times);
            },
            confirm: function(message, onSuccess) {
                alert(message);
                onSuccess(0);
            },
            vibrate: function(ms) {
                console.log('vvvviiiibbbrrate for ' + ms + 'ms');
            }
        },

        service: {
            contacts: {
                find: function(filter, onSuccess, onFail, options) {
                    onSuccess([
                        { displayName: 'Michael Brooks' },
                        { displayName: 'Fil Maj' },
                        { displayName: 'Brett Rudd' },
                        { displayName: 'Andrew Lunny' }
                    ]);
                }
            }
        }
    };

    window.device = {
        name: 'iPhone',
        uuid: 'adssfd888',
        platform: 'iOS 4.3',
        version: '4.3',
        phonegap: '0.9.4'
    };

    window.ContactFindOptions = function() {};

    window.NetworkStatus = {
        NOT_REACHABLE: 0,
        REACHABLE_VIA_CARRIER_DATA_NETWORK: 1,
        REACHABLE_VIA_WIFI_NETWORK: 2
    };
    

})();