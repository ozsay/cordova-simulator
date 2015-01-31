/*global define */
/*jslint white: true */

define(['angular', 'plugins/services'], function(angular) {
    'use strict';

    var app = angular.module('cordovaSimulator.plugins', [
        'cordovaSimulator.plugins.services'
    ]);

    return app;
});