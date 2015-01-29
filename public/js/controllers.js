/*global define */
/*jslint white: true */

define(['angular'], function(angular) {
    'use strict';

    angular.module('cordovaSimulator.controllers', [])
    .controller('mainController', ['$scope', '$location', 'configuration', function($scope, $location, configuration) {
        $scope.save = configuration.save;
        $scope.reset = configuration.reset;
        $scope.loadFromGist = configuration.loadFromGist;

        $scope.exportConfiguration = configuration.exportConfiguration;
        $scope.importConfiguration = function(files) {
            configuration.importConfiguration(JSON.parse(files[0].content));        
        };
    }]);
});