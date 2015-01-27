'use strict';

angular.module('cordovaSimulator.directives', [])
.directive('device', ['plugins', function(plugins) {
    return {
    restrict: 'E',
    controller: ['$scope', function($scope) {
        $scope.isLandscape = $scope.device.preset.width > $scope.device.preset.height;
        
        $scope.toggleOrientation = function() {
            $scope.isLandscape = !$scope.isLandscape;
        }
    }],
    link: function(scope, element, attrs) {
        var iframe = element.find('iframe');
        scope.appName = attrs.appName;
        
        iframe.attr("src", '/apps/' + scope.appName);
        
        scope.reload = function() {
            iframe.attr("src", iframe.attr("src"));
        }
        
        iframe.on('load', function() {
            var iframeWindow = document.getElementById(scope.appName + '_' + scope.device.id).contentWindow;
            plugins.wire({
                window: iframeWindow,
                iframe: iframe,
                device: scope.devices[scope.device.id],
                app: scope.apps[scope.appName],
                scope: scope
            });
        });
        
        scope.$watch('device.preset.platform', function(value) {
            iframe.attr("src", iframe.attr("src"));
        });
    },
    templateUrl: 'partials/device.html',
    replace: true
  };
}])
.directive('presetConfig', [function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/presetConfig.html',
        replace: true,
        controller: ['$scope', function($scope) {
            $scope.deletePreset = function() {
                delete $scope.presets[$scope.preset.name];
            }

            $scope.addPreset = function() {
                $scope.presets[preset.name] = $scope.preset;
                $scope.preset = {};
            }
        }],
        link: function(scope, element, attrs) {
            scope.new = attrs.new != undefined;
        }
    }
}])
.directive('inputFile', ['api', function(api) {
    return {
        restrict: 'A',
        scope: {
            inputFile: '=inputFile'
        },
        link: function(scope, element, attrs) {
            var input = $('<input type="file"></input>').css({
                "display": 'none'
            });
            
            if (attrs.multiple != undefined) {
                input.attr("multiple", "");
            }
            
            input.change(function(e) {
                api.fileReaderApi.read(e.target.files, scope.inputFile);
            });
            
            element.after(input);
            
            element.click(function () {
                input.focus().click();
            });
        }
    }
}])
.directive('alerts', ['$compile', 'alertSystem', function($compile, alertSystem) {
    var template = "<div class=\"alert alert-{{type}} alert-dismissible fade in\" role=\"alert\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>" +
                        "<strong>{{strong}}</strong> {{text}}" +
                    "</div>";
    
    return {
        restrict: 'E',
        scope: true,
        link: function(scope, element, attrs) {
            function createAlert(childScope) {
                var alert = $compile(template)(childScope);
                
                alert.on('closed.bs.alert', function () {
                    childScope.$destroy();
                });
                
                element.prepend($compile(template)(childScope));
            }
            
            alertSystem.listen(function(type, strong, text) {
                var childScope = scope.$new(false, scope);
                childScope.type = type;
                childScope.text = text;
                childScope.strong = strong;
                
                if (element.find('.alert').length > 3) {
                    $('.alert:last-child').on('closed.bs.alert', function () {
                        createAlert(childScope);
                        childScope.$digest();
                    });
                    
                    $('.alert:last-child').alert('close');
                } else {
                    createAlert(childScope);
                }
            });
        }
    }
}]);