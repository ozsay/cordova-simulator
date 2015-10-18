angular.module('demo.plugins', [])
.constant('pluginsList', {
  platformClass: {
    title: 'Platform class'
  },
  reload: {
    title: 'Reload'
  },
  clipboard: {
    title: 'Clipboard',
    controller: true
  },
  device: {
    controller: true,
    title: 'Device',
    icon: 'ion-iphone'
  },
  flashlight: {
    title: 'Flashlight',
    controller: true
  }
})
.controller('deviceController', function($scope) {
  $scope.device = device;
})
.controller('clipboardController', function($scope) {
  $scope.copy = function(text) {
    cordova.plugins.clipboard.copy(text);
  };

  $scope.paste = function() {
    cordova.plugins.clipboard.paste(
      function (result) {
        $scope.$apply(function() {
          $scope.pastedText = result;
        });
      });
    };
  }).controller('flashlightController', function($scope) {
    $scope.on = function () {
      window.plugins.flashlight.switchOn();
    };
    $scope.off = function () {
      window.plugins.flashlight.switchOff();
    };
    $scope.toggle = function () {
      window.plugins.flashlight.toggle();
    };
  });
