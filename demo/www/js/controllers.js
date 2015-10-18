angular.module('demo.controllers', [])
.controller('pluginsListController', function($scope, $http, pluginsList) {
    $scope.plugins = pluginsList;
});
