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
.provider('platformClass', function(pluginsProvider) {
    pluginsProvider.register('platformClass', this);
    
    this.$get = [function() {
        return {
            wire: function(obj) {
                if (obj.window.ionic != undefined) {
                    obj.window.ionic.Platform.setPlatform(obj.preset.platform);
                } else {
                    var platformClass = "platform-" + obj.preset.platform;
                    obj.iframe.contents().find('body').removeClass(platformClass).addClass(platformClass);
                }
            }
        };
    }];
});

angular.module('cordovaSimulator.plugins')
.provider('reload', function(pluginsProvider) {
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