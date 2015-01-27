'use strict';

angular.module('cordovaSimulator.services', [])
.provider('configuration', [function() {
    var provider = this;
    this.defaults = {
        platforms: ['android', 'ios'],
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
    
    function stringsToPresets(config) {
        angular.forEach(config.devices, function(device) {
            device.preset = config.presets[device.preset];
        });
        
        return config;
    }
    
    function presetsToStrings(config) {
        angular.forEach(config.devices, function(device) {
                device.preset = device.preset.name;
        });
        
        return config;
    }
    
    this.$get = ['$http', '$rootScope', '$q', 'api', 'alertSystem', function($http, $rootScope, $q, api, alertSystem) {
        var load = function(config) {
            var promises = [];            
            
            config = stringsToPresets(angular.copy(config) || 
                                      api.storageApi.get('configuration') || 
                                      angular.copy(provider.defaults));
            $rootScope.config = config;

            if ($rootScope.config.platforms === undefined) 
                $rootScope.config.platforms = [];
            if ($rootScope.config.presets === undefined) 
                $rootScope.config.presets = {};
            if ($rootScope.config.devices === undefined) 
                $rootScope.config.devices = {};
            if ($rootScope.config.apps === undefined) 
                $rootScope.config.apps = {};
            if ($rootScope.config.plugins === undefined) 
                $rootScope.config.plugins = {};
            
            $rootScope.platforms = config.platforms;
            $rootScope.presets = config.presets;
            $rootScope.devices = config.devices;
            $rootScope.apps = config.apps;
            $rootScope.plugins = config.plugins;
            
            var deferred1 = $q.defer();
            
            promises.push(deferred1.promise);
            
            api.serverApi.get('resources', function(resources) {
                $rootScope.resources = resources;
                deferred1.resolve();
            });
            
            var deferred2 = $q.defer();
            
            promises.push(deferred2.promise);
            
            api.serverApi.get('apps', function(apps) {
                angular.forEach(apps, function(app) {
                    if ($rootScope.apps[app.name] === undefined) {
                        $rootScope.apps[app.name] = {
                            name: app.name,
                            path: app.path,
                            served: true
                        };
                    } else {
                        $rootScope.apps[app.name].served = true;
                        $rootScope.apps[app.name].path = app.path;
                    }
                });
                
                deferred2.resolve();
            });
            
            return $q.all(promises);
        }
        
        var save = function() {
            var config = presetsToStrings(angular.copy($rootScope.config));

            angular.forEach(config.apps, function(app) {
                delete app.served;
                delete app.path;
            });
            
            api.storageApi.set('configuration', config);
        }
        
        var reset = function() {
            load(provider.defaults);
        }
        
        var _export = function() {
            var config = presetsToStrings(angular.copy($rootScope.config));
            
            angular.forEach(config.apps, function(app) {
                delete app.served;
                delete app.path;
            });
            
            api.fileSaveApi.save("configuration.json", JSON.stringify(config, null, 2));
        }
        
        var _import = function(config) {
            load(config);
        }
        
        var loadFromGist = function() {
            $http.get('https://api.github.com/gists/35f975e0836d3555ebe1')
            .success(function(data) {
                try {
                    var gist = JSON.parse(data.files['cordova-simulator-presets'].content);

                    angular.forEach(gist.platforms, function(platform) {
                        if ($rootScope.config.platforms.indexOf(platform) == -1) {
                            $rootScope.config.platforms.push(platform);
                        }
                    });

                    angular.forEach(gist.presets, function(preset, name) {
                        if ($rootScope.config.presets[name] == undefined) {
                            $rootScope.config.presets[name] = preset;
                        }
                    });
                } catch (e) {
                    alertSystem.warning('Can\'t load gist', 'Json parsing has failed.');
                }
            })
            .error(function() {
                alertSystem.warning('Can\'t load gist', 'http get has failed.');
            });
        }
        
        return {
            load: load,
            save: save,
            reset: reset,
            export: _export,
            import: _import,
            loadFromGist: loadFromGist
        };
    }];
}])
.factory('api', ['$window', '$q', function($window, $q) {
    var storageApi = {
        get: function(key) {
            if ($window.localStorage[key] != undefined)
                return JSON.parse($window.localStorage[key]);
            else return null;
        },
        set: function(key, val) {
            $window.localStorage[key] = JSON.stringify(val);
        }
    };
    
    var fileSaveApi = {
        save: function(name, text) {
            var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
            
            saveAs(blob, name);
        }
    }
    
    var fileReaderApi = {
        read: function(files, cb) {
            var contents = {};
            var promises = [];
            
            angular.forEach(files, function(file) {
                var reader = new FileReader();
                var deferred = $q.defer();
                
                reader.onload = function(e) {
                    deferred.resolve({
                        "name": file.name,
                        "content": e.target.result
                    });
                };
                
                promises.push(deferred.promise);
                reader.readAsText(file);
            });
            
            if (cb == undefined || typeof cb != "function") {
                return $q.all(promises);
            } else {
                $q.all(promises).then(cb);
            }
        }
    }
    
    var server = io.connect();
    var serverApi = {
        emit: function(event, data) {
            if (server != undefined) {
                server.emit(event, data);
            }
        },
        on: function(event, cb) {
            if (server != undefined) {
                server.on(event, cb);
            }
        },
        removeListener: function(event, cb) {
            if (server != undefined) {
                server.removeListener(event, cb);
            }
        },
        get: function(url, cb) {
            var res = url + 'Response';
            
            function callback() {
                cb.apply(this, arguments);
                this.removeListener(res, callback);
            }
            
            this.on(res, callback);
            
            this.emit(url);
        }
    }
    
    return {
        storageApi: storageApi,
        fileSaveApi: fileSaveApi,
        fileReaderApi: fileReaderApi,
        serverApi: serverApi
    };
}])
.factory('alertSystem', ['$rootScope', function($rootScope) {
    return {
        TYPES: {
            SUCCESS: 'success',
            INFO: 'info',
            WARNING: 'warning',
            DANGER: 'danger'
        },
        listen: function(listener) {
            $rootScope.$on('alert', function(event, type, strong, text) {
                listener(type, strong, text);
            });
        },
        emit: function(type, strong, text) {
            $rootScope.$emit('alert', type, strong, text);
        },
        success: function(strong, text) {
            this.emit(this.TYPES.SUCCESS, strong, text);
        },
        info: function(strong, text) {
            this.emit(this.TYPES.INFO, strong, text);
        },
        warning: function(strong, text) {
            this.emit(this.TYPES.WARNING, strong, text);
        },
        danger: function(strong, text) {
            this.emit(this.TYPES.DANGER, strong, text);
        }
    }
}]);