'use strict';

angular.module('cordovaSimulator.controllers', [])
.controller('mainController', ['$scope', '$location', 'configuration', 'api', function($scope, $location, configuration, api) {
    $scope.save = configuration.save;
    $scope.reset = configuration.reset;
    $scope.loadFromGist = configuration.loadFromGist;
    
    $scope.export = configuration.export;
    $scope.import = function(files) {
        configuration.import(JSON.parse(files[0].content));        
    };
}]);