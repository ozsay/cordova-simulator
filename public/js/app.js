'use strict';

angular.module('cordovaSimulator', [
    'cordovaSimulator.filters',
    'cordovaSimulator.services',
    'cordovaSimulator.directives',
    'cordovaSimulator.controllers',
    'cordovaSimulator.plugins'
])
.run(['configuration', '$rootScope', function(configuration, $rootScope) {
    configuration.load().then(function() {
        $rootScope.appReady = true;
    });
}]);