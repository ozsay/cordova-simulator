angular.module('demo.plugins', [])
.constant('pluginsList', {
    platformClass: {
        title: 'Platform class'
    },
    reload: {
        title: 'Reload'
    },
    device: {
        controller: true,
        title: 'Device',
        icon: 'ion-iphone'
    },
    appVersion: {
        title: 'App Version',
        controller: true
    },
    vibration: {
        title: 'Vibration',
        controller: true
    },
    clipboard: {
        title: 'Clipboard',
        controller: true
    },
    flashlight: {
        title: 'Flashlight',
        controller: true
    },
    batterystatus: {
        title: 'Battery Status',
        controller: true
    }
})
.controller('deviceController', function($scope, $cordovaDevice) {
    $scope.device = $cordovaDevice.getDevice();
})
.controller('clipboardController', function($scope, $cordovaClipboard) {
    $scope.copy = function(text) {
        $cordovaClipboard.copy(text);
    }
    
    $scope.paste = function() {
        $cordovaClipboard.paste()
        .then(function (result) {
            $scope.pastedText = result;
        })
    }
    
})
.controller('appVersionController', function($scope, $cordovaAppVersion) {
    $cordovaAppVersion.getAppVersion().then(function (version) {
        $scope.version = version;
    });
})
.controller('vibrationController', function($scope, $cordovaVibration) {
    $scope.vibrate = function(duration) {
        $cordovaVibration.vibrate(duration);
    }
})
.controller('flashlightController', function($scope, $cordovaFlashlight) {
    $scope.on = $cordovaFlashlight.switchOn;
    $scope.off = $cordovaFlashlight.switchOff;
    $scope.toggle = $cordovaFlashlight.toggle;
})
.controller('batterystatusController', function($scope, $rootScope, $cordovaBatteryStatus) {
    $rootScope.$on('$cordovaBatteryStatus:status', function (e, result) {
        $scope.level = result.level;
        $scope.isPlugged = result.isPlugged;
        
        if (result.level > 20) {
            $scope.status = "ok";
        }
    });
    $rootScope.$on('$cordovaBatteryStatus:critical', function (e, result) {
      $scope.status = "critical";
    });

    $rootScope.$on('$cordovaBatteryStatus:low', function (e, result) {
      $scope.status = "low";
    });
});