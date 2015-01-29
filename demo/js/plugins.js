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
    window.addEventListener("batterystatus", onBatteryStatus, false);

function onBatteryStatus(info) {
    console.log(info);
    // Handle the online event
    console.log("Level: " + info.level + " isPlugged: " + info.isPlugged);
}
    
    
    
    $rootScope.$on('$cordovaBatteryStatus:status', function (event, result) {
        $scope.level = result.info.level;
        $scope.isPlugged = result.info.isPlugged;
        $scope.status = result.info.status;
    });
});