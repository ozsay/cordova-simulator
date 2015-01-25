'use strict';

angular.module('cordovaSimulator.controllers', [])
.controller('mainController', function($scope, $location, configuration) {
    $scope.devices = configuration.get().devices;
    
    $scope.save = configuration.save;
    $scope.reset = configuration.reset;
    $scope.loadFromGist = configuration.loadFromGist;
    
})
.controller('presetsConfig', function($scope, configuration) {
    $scope.presets = configuration.get().presets;
    $scope.platforms = configuration.get().platforms;
    
    $scope.deletePreset = function(preset) {
        delete $scope.presets[preset];
    }
})
.controller('devicesConfig', function($scope, configuration) {
    $scope.devices = configuration.get().devices;
});