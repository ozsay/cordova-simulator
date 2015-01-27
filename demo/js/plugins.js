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
});