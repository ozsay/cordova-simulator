'use strict';

angular.module('cordovaSimulator.plugins', [])
.provider('plugins', function() {
    var pluginsProviders = {};
    
    this.register = function(name, pluginProvider) {
        pluginsProviders[name] = pluginProvider;
    }
    
    this.$get = function($injector) {
        var plugins = {};
        
        angular.forEach(pluginsProviders, function(provider, name) {
            plugins[name] = $injector.invoke(provider.$get);
        });
        
        return {
            wire: function(obj) {
                angular.forEach(plugins, function(plugin) {
                    plugin.wire(obj);
                });
            }
        };
    }
});

angular.module('cordovaSimulator.plugins')
.provider('plugins.platformClass', function(pluginsProvider) {
    pluginsProvider.register('platformClass', this);
    
    this.$get = [function() {
        return {
            wire: function(obj) {
                if (obj.window.ionic != undefined) {
                    obj.window.ionic.Platform.setPlatform(obj.device.preset.platform);
                } else {
                    var platformClass = "platform-" + obj.device.preset.platform;
                    obj.iframe.contents().find('body').removeClass(platformClass).addClass(platformClass);
                }
            }
        };
    }];
});

angular.module('cordovaSimulator.plugins')
.provider('plugins.reload', function(pluginsProvider) {
    pluginsProvider.register('reload', this);
    
    this.$get = ['socket', function(socket) {
        return {
            wire: function(obj) {
                socket.on('reload', function() {
                    obj.iframe.attr("src", obj.iframe.attr("src"));
                });
            }
        };
    }];
});

angular.module('cordovaSimulator.plugins')
.provider('plugins.device', function(pluginsProvider) {
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
});