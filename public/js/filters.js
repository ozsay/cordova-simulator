/*global define */
/*jslint white: true */

define(['angular'], function(angular) {
    'use strict';

    angular.module('cordovaSimulator.filters', [])
    .filter('deviceOrientation', [function() {
        return function(input, isLandscape) {
            if (isLandscape) {
                return {
                    width: input.height,
                    height: input.width
                };
            }
            else {
                return input;
            }
        };
    }]).filter('flashlight', [function() {
        return function(input) {
            return input ? 'flashlight on' : 'flashlight';
        };
    }]);
});