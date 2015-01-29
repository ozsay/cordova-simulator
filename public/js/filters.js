/*global define */
/*jslint white: true */

define(['angular'], function(angular) {
    'use strict';

    angular.module('cordovaSimulator.filters', [])
    .filter('deviceOrientation', [function() {
        return function(input, width, height, isLandscape) {
            if (isLandscape) {
                return {
                    width: height,
                    height: width
                };
            }
            else {
                return {
                    width: width,
                    height: height
                };
            }
        };
    }]).filter('flashlight', [function() {
        return function(input) {
            return input ? 'flashlight on' : 'flashlight';
        };
    }]);
});