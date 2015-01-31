/*global define, FileReader */
/*jslint white: true */

define(['angular'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator.plugins.services', [])
    .factory('plugins', ['$q', function($q) {
        var actions = {},
            directPlugins = {};
        
        return {
            register: function(plugin, fn) {
                directPlugins[plugin] = fn;
            },
            wire: function(cordova) {
                angular.forEach(directPlugins, function(plugin, name) {
                    cordova.define(name, plugin);
                });
            },
            registerCommand: function(plugin, method, fn) {
                if (actions[plugin] === undefined) {
                    actions[plugin] = {};
                }
                
                actions[plugin][method] = {fn: fn};
            },
            registerCommandWithFunctions: function(plugin, method, fn) {
                if (actions[plugin] === undefined) {
                    actions[plugin] = {};
                }
                
                actions[plugin][method] = {fn: fn, functions: true};
            },
            execCommand: function(obj, success, fail, plugin, action, args) {
                if (actions[plugin][action].functions) {
                    actions[plugin][action].fn(obj, success, fail, args);
                } else {
                    success = success || function() {};
                    fail = fail || function() {};

                    var result = actions[plugin][action].fn(obj, args);

                    if (result !== undefined && typeof result.then === 'function') {
                        result.then(function(res) {
                            success(res);
                        }, function(err) {
                            fail(err);
                        });
                    } else {
                        success(result);
                    }
                }
            }
        };
    }]);
    
    return app;
});