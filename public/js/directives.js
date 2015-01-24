'use strict';

angular.module('cordovaSimulator.directives', [])
.directive('device', function(socket, plugins) {
    return {
    restrict: 'E',
    scope: {
        deviceId: '@deviceId'
    },
    controller: function($scope, device, configuration) {
        $scope.device = device.get($scope.deviceId);
        $scope.preset = configuration.get().presets[$scope.device.preset];
        
        $scope.width = $scope.preset.width;
        $scope.height = $scope.preset.height;
        $scope.platform = $scope.preset.platform;
        $scope.isLandscape = $scope.width > $scope.height;
        
        $scope.toggleOrientation = function() {
            var tmpWidth = $scope.width;
            $scope.width = $scope.height;
            $scope.height = tmpWidth;
            $scope.isLandscape = !$scope.isLandscape;
        }
        
        $scope.$watch('preset.width', function(value) {
            if ($scope.isLandscape)
                $scope.height = value;
            else $scope.width = value;
        });
        
        
        $scope.$watch('preset.height', function(value) {
            if ($scope.isLandscape)
                $scope.width = value;
            else $scope.height = value;
        });
        
        $scope.$watch('preset.platform', function(value) {
            $scope.platform = value;
        });
    },
    link: function(scope, element, attrs) {
        var iframe = element.find('iframe');

        iframe.on('load', function() {
            var iframeWindow = document.getElementById(scope.deviceId).contentWindow;
            plugins.wire({
                window: iframeWindow,
                iframe: iframe,
                device: scope.device,
                preset: scope.preset
            });
        });
        
        scope.$watch('width', function(value) {
            iframe.css({width: value});
            element.css({width: value});
        });
        
        scope.$watch('height', function(value) {
            iframe.css({height: value});
        });
        
        scope.$watch('platform', function(value) {
            iframe.attr("src", iframe.attr("src"));
        });
    },
    templateUrl: 'partials/device.html',
    replace: true
  };
});