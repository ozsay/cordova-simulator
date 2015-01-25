'use strict';

angular.module('cordovaSimulator.services', [])
.factory('configuration', function(api, $http) {
    var defaultConfig = {
        platforms: ['android', 'ios', 'wp8'],
        presets: {
            genericAndroid: {
                name: 'genericAndroid',
                platform: 'android',
                platformVersion: '5.0',
                model: 'SG4',
                width: 337,
                height: 667
            },
            genericIphone: {
                name: 'genericIphone',
                platform: 'ios',
                platformVersion: '7.0',
                model: 'iphone6',
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
    
    function fixPresets() {
        angular.forEach(config.devices, function(device) {
            device.preset = config.presets[device.preset];
        });
    }
    
    var config = api.storageApi.get('configuration') || defaultConfig;
    fixPresets();
    
    return {
        save: function() {
            var conf = angular.copy(config);
            angular.forEach(conf.devices, function(device) {
                device.preset = device.preset.name;
            });

            api.storageApi.set('configuration', conf);
        },
        get: function() {
            return config;
        },
        reset: function() {
            config = defaultConfig;
            fixPresets();
            
            this.save();
        },
        loadFromGist: function() {
            $http.get('https://api.github.com/gists/35f975e0836d3555ebe2')
            .success(function(data) {
                try {
                    var gist = JSON.parse(data.files['cordova-simulator-presets'].content);

                    angular.forEach(gist.platforms, function(platform) {
                        if (config.platforms.indexOf(platform) == -1) {
                            config.platforms.push(platform);
                        }
                    });

                    angular.forEach(gist.presets, function(preset, name) {
                        if (config.presets[name] == undefined) {
                            config.presets[name] = preset;
                        }
                    });
                } catch (e) {
                    console.log('Couldn\'t load platforms and presets from gist due to: ' + e.message);
                }
            });
        }
    }
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
            $window.localStorage[key] = JSON.stringify(val);
        }
    };
    return {
        storageApi: storageApi
    };
});