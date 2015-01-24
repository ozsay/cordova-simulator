'use strict';

angular.module('cordovaSimulator.services', [])
.factory('configuration', function(api) {
    var defaultConfig = {
        platforms: ['android', 'ios', 'wp8'],
        presets: {
            genericAndroid: {
                platform: 'android',
                width: 337,
                height: 667
            },
            genericIphone: {
                platform: 'ios',
                width: 337,
                height: 667
            }
        },
        devices: {
            android: {
                id: 'android',
                preset: 'genericAndroid'
            },
            iphone: {
                id: 'iphone',
                preset: 'genericIphone'
            }
        }
    };
    var config = defaultConfig;
    
    return {
        load: function() {
            config = api.storageApi.get('configuration');
        },
        save: function() {
            api.storageApi.set('configuration', config);
        },
        get: function() {
            return config;
        }
    }
})
.factory('device', function(configuration) {
    return {
        all: function() {
            return configuration.get().devices;
        },
        get: function(id) {
            return configuration.get().devices[id];
        }
    };
})
.factory('socket', function() {
    return io.connect();
})
.factory('api', function($window) {
    var storageApi = {
        isAvailable: function() {
            return $window.localStorage != undefined;
        },
        get: function(key) {
            if ($window.localStorage[key] != undefined)
                return JSON.parse($window.localStorage[key]);
            else return null;
        }, 
        set: function(key, val) {
            $window.localStorage[key] = JSON.stringify(value);
        }
    };
    return {
        storageApi: storageApi
    };
});