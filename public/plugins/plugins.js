/*global define */
/*jslint white: true */

define(['angular'], function(angular) {
    'use strict';

    angular.module('cordovaSimulator.plugins.platformClass', ['cordovaSimulator.plugins'])
    .factory('platformClass', ['plugins', function(plugins) {
        var fn = function() {
        };
        
        plugins.register('platformClass', fn);
        
        return {
            /*wire: function(obj) {
                if (obj.window.ionic !== undefined) {
                    obj.window.ionic.Platform.setPlatform(obj.device.preset.platform);
                }
                var platformClass = "platform-" + obj.device.preset.platform;
                obj.iframe.contents().find('body').removeClass(platformClass).addClass(platformClass);
            }*/
        };
    }]);

    angular.module('cordovaSimulator.plugins.reload', ['cordovaSimulator.plugins'])
    .factory('reload', ['plugins', function(plugins) {
        var fn = function() {
        };
        
        plugins.register('reload', fn);
        
        return {
             wire: function(obj) {
                    /*api.on('reload', function() {
                        obj.iframe.attr("src", obj.iframe.attr("src"));
                    });*/
                }
        };
    }]);  
});