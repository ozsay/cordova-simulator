/*global define */
/*jslint white: true */

define(['angular'], function(angular) {
    'use strict';

    angular.module('cordovaSimulator.plugins', [])
    .provider('plugins', [function() {
        var pluginsProviders = {};

        this.register = function(name, pluginProvider) {
            pluginsProviders[name] = pluginProvider;
        };

        this.fireEvent = function(type, doc, target, obj) {
            var event = doc.createEvent('Events');
            event.initEvent(type, false, false);
            event[obj.key] = obj.val;

            target.dispatchEvent(event);
        };
        
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
                    obj.window.plugins = {};
                    
                    if (obj.window.navigator.notification === undefined) {
                        obj.window.navigator.notification = {};
                    }

                    angular.forEach(plugins, function(plugin) {
                        plugin.wire(obj);
                    });
                }
            };
        }];
    }]);

    angular.module('cordovaSimulator.plugins')
    .provider('plugins.platformClass', ['pluginsProvider', function(pluginsProvider) {
        pluginsProvider.register('platformClass', this);

        this.$get = [function() {
            return {
                wire: function(obj) {
                    if (obj.window.ionic !== undefined) {
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

        this.$get = ['serverApi', function(api) {
            return {
                wire: function(obj) {
                    api.on('reload', function() {
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
                                deferred = obj.window.jQuery.Deferred();
                                toReturn = deferred;
                            } else if(obj.window.angular){
                                deferred = $q.defer();
                                toReturn = deferred.promise;
                            } else {
                                return console.error('AppVersion either needs a success callback, or jQuery/AngularJS defined for using promises');
                            }
                            success = deferred.resolve;
                            fail = deferred.reject;
                        } 

                        if (obj.app.version === undefined) {
                            if (fail !== undefined) {
                                fail ("App doesn't contain version");
                            }
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
                        var arr = typeof vibration === 'number' ? [vibration] : vibration;

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
                    var text;
                    obj.window.cordova.plugins.clipboard = {
                        copy: function(textToCopy, success, fail) {
                            if (typeof textToCopy === "undefined" || textToCopy === null) {
                                 text = "";
                            }
                            success = success || function() {};
                            text = textToCopy;

                            success(text);
                        },
                        paste: function(success, fail) {
                            success(text);
                        }
                    };
                }
            };
        }];
    }]);

    angular.module('cordovaSimulator.plugins')
    .provider('plugins.flashlight', ['pluginsProvider', function(pluginsProvider) {
        pluginsProvider.register('flashlight', this);

        this.$get = [function() {
            return {
                wire: function(obj) {
                    obj.window.plugins.flashlight = {};
                    
                    obj.window.plugins.flashlight.available = function(cb) {
                        cb(true);
                    };
                    
                    obj.window.plugins.flashlight.toggle = function(success, error) {
                        if (obj.scope.flashlight === true) {
                            obj.window.plugins.flashlight.switchOff(success, error);
                        } else {
                            obj.window.plugins.flashlight.switchOn(success, error);
                        }
                    };
                    
                    obj.window.plugins.flashlight.switchOn = function(success, error) {
                        obj.scope.flashlight = true;
                        obj.scope.$digest();
                        success(true);
                    };
                    
                    obj.window.plugins.flashlight.switchOff = function(success, error) {
                        obj.scope.flashlight = false;
                        obj.scope.$digest();
                        success(true);
                    };
                }
            };
        }];
    }]);
    
    angular.module('cordovaSimulator.plugins')
    .provider('plugins.batterystatus', ['pluginsProvider', function(pluginsProvider) {
        pluginsProvider.register('batterystatus', this);

        this.$get = [function() {
            return {
                wire: function(obj) {
                    var doc = obj.iframe.contents();
                    obj.window.navigator.battery = {};
                    
                    obj.scope.$watch('battery', function(value) {
                        var status = "ok";
                        if ((value < 30) && (value > 5)) {
                            status = "low";
                        } else if (value < 5) {
                            status = "critical";
                        }
                        
                        pluginsProvider.fireEvent('batterystatus', obj.window.document, obj.window, {
                            key: 'info',
                            val: {level: value, status: status, isPlugged: obj.scope.isPlugged}
                        });
                    });
                    
                    obj.scope.$watch('isPlugged', function(value) {
                    });
                    
                    obj.scope.$digest();
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
});