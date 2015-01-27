'use strict';

angular.module('cordovaSimulator.plugins', [])
.provider('plugins', [function() {
    var pluginsProviders = {};
    
    this.register = function(name, pluginProvider) {
        pluginsProviders[name] = pluginProvider;
    }
    
    this.$get = ['$injector', function($injector) {
        var plugins = {};
        
        angular.forEach(pluginsProviders, function(provider, name) {
            plugins[name] = $injector.invoke(provider.$get);
        });
        
        return {
            wire: function(obj) {
                obj.window.cordova = {
                    plugins: {}
                };
                
                if (obj.window.navigator.notification == undefined) {
                    obj.window.navigator.notification = {};
                }
                
                angular.forEach(plugins, function(plugin) {
                    plugin.wire(obj);
                });
            }
        };
    }]
}]);

angular.module('cordovaSimulator.plugins')
.provider('plugins.platformClass', ['pluginsProvider', function(pluginsProvider) {
    pluginsProvider.register('platformClass', this);
    
    this.$get = [function() {
        return {
            wire: function(obj) {
                if (obj.window.ionic != undefined) {
                    obj.window.ionic.Platform.setPlatform(obj.device.preset.platform);
                }
                var platformClass = "platform-" + obj.device.preset.platform;
                obj.iframe.contents().find('body').removeClass(platformClass).addClass(platformClass);
                
            }
        };
    }];
}]);

angular.module('cordovaSimulator.plugins')
.provider('plugins.reload', ['pluginsProvider', function(pluginsProvider) {
    pluginsProvider.register('reload', this);
    
    this.$get = ['api', function(api) {
        return {
            wire: function(obj) {
                api.serverApi.on('reload', function() {
                    obj.iframe.attr("src", obj.iframe.attr("src"));
                });
            }
        };
    }];
}]);

angular.module('cordovaSimulator.plugins')
.provider('plugins.device', ['pluginsProvider', function(pluginsProvider) {
    pluginsProvider.register('device', this);
    
    function Device(device) {
        this.available = true;
        this.platform = device.preset.platform;
        this.version = device.preset.platformVersion;
        this.uuid = '1A2FDEF0-C09D-4DB4-A8BE-7EC2F4A6E49A';
        this.cordova = '4.2.0';
        this.model = device.preset.model;
    }
    
    this.$get = [function() {
        return {
            wire: function(obj) {
                obj.window.device = 
                    new Device(obj.device);
            }
        };
    }];
}]);

angular.module('cordovaSimulator.plugins')
.provider('plugins.appVersion', ['pluginsProvider', function(pluginsProvider) {
    pluginsProvider.register('appVersion', this);
        
    this.$get = ['$q', function($q) {
        return {
            wire: function(obj) {
                obj.window.cordova.getAppVersion = function(success, fail) {
                    var toReturn, deferred;
                    if ((typeof success) === 'undefined') {
                        if(obj.window.jQuery){
                            deferred = jQuery.Deferred();
                            toReturn = deferred;
                        } else if(obj.window.angular){
                            deferred = $q.defer();
                            toReturn = deferred.promise
                        } else {
                            return console.error('AppVersion either needs a success callback, or jQuery/AngularJS defined for using promises');
                        }
                        success = deferred.resolve;
                        fail = deferred.reject;
                    } 
                    
                    if (obj.app.version === undefined) {
                        if (fail != undefined)
                            fail ("App doesn't contain version");
                    }
                    
                    success(obj.app.version);
                    
                    return toReturn;
                };
            }
        };
    }];
}]);

angular.module('cordovaSimulator.plugins')
.provider('plugins.vibration', ['pluginsProvider', function(pluginsProvider) {
    pluginsProvider.register('vibration', this);
    
    this.$get = [function() {
        return {
            wire: function(obj) {
                obj.window.navigator.vibrate = function(vibration) {
                    var arr = typeof vibration == 'number' ? [vibration] : vibration;

                    obj.iframe.addClass("shake shake-constant");  
                    
                    setTimeout(function() {
                        obj.iframe.removeClass("shake shake-constant");
                    }, arr[0]);
                };
                
                obj.window.navigator.notification.vibrate = obj.window.navigator.vibrate;
            }
        };
    }];
}]);

angular.module('cordovaSimulator.plugins')
.provider('plugins.clipboard', ['pluginsProvider', function(pluginsProvider) {
    pluginsProvider.register('clipboard', this);
    
    this.$get = [function() {
        return {
            wire: function(obj) {
                var _text;
                obj.window.cordova.plugins.clipboard = {
                    copy: function(text, success, fail) {
                        if (typeof text === "undefined" || text === null) 
                             text = "";
                        success = success || function() {};
                        _text = text;
                        
                        success(text);
                    },
                    paste: function(success, fail) {
                        success(_text);
                    }
                }
            }
        };
    }];
}]);

/*
        Template
        --------
        
angular.module('cordovaSimulator.plugins')
.provider('plugins.pluginName', ['pluginsProvider', function(pluginsProvider) {
    pluginsProvider.register('pluginName', this);
    
    this.$get = [function() {
        return {
            wire: function(obj) {
            }
        };
    }];
}]);

*/
