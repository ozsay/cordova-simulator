angular.module('demo.plugins', [])
.constant('pluginsList', {
  platformClass: {
    title: 'Platform class'
  },
  reload: {
    title: 'Reload'
  },
  actionsheet: {
    title: 'Action Sheet',
    controller: true
  },
  appVersion: {
    title: 'App Version',
    controller: true
  },
  batterystatus: {
    title: 'Battery Status',
    controller: true
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
  dialogs: {
    title: 'Dialogs',
    controller: true
  },
  flashlight: {
    title: 'Flashlight',
    controller: true
  },
  networkinfo: {
    title: 'Network Info',
    controller: true
  },
  vibration: {
    title: 'Vibration',
    controller: true
  }
})
.controller('actionsheetController', function($scope) {
  var options = {
    title: 'This is an action sheet',
    buttonLabels: ['Option1', 'Option2'],
    addCancelButtonWithLabel: 'Cancel',
    androidEnableCancelButton : true,
    winphoneEnableCancelButton : true,
    addDestructiveButtonWithLabel : 'Destructive Action'
  };

  $scope.show = function() {
    window.plugins.actionsheet.show(options, function(btnIndex) {
      $scope.$apply(function() {
        $scope.index = btnIndex;
      });
    });
  };
})
.controller('appVersionController', function($scope) {
  cordova.getAppVersion.getVersionNumber(function (versionNumber) {
    $scope.$apply(function() {$scope.versionNumber = versionNumber;});
  });

  cordova.getAppVersion.getVersionCode(function (versionCode) {
    $scope.$apply(function() {$scope.versionCode = versionCode;});
  });

  cordova.getAppVersion.getAppName(function (appName) {
    $scope.$apply(function() {$scope.appName = appName;});
  });

  cordova.getAppVersion.getPackageName(function (packageNumber) {
    $scope.$apply(function() {$scope.packageNumber = packageNumber;});
  });
})
.controller('batterystatusController', function($scope) {
  window.addEventListener("batterystatus", callback, false);
  window.addEventListener("batterylow", callback, false);
  window.addEventListener("batterycritical", callback, false);

  function callback(info) {
    $scope.$apply(function() {
      $scope.level = info.level;
      $scope.isPlugged = info.isPlugged;
    });
  }
})
.controller('deviceController', function($scope) {
  $scope.device = device;
})
.controller('dialogsController', function($scope) {
  $scope.alert = function() {
    navigator.notification.alert('alert dialog', function() {
    });
  };

  $scope.prompt = function() {
    navigator.notification.prompt('write text', function(btnIndex) {
      console.log(btnIndex);
    });
  };

  $scope.confirm = function() {
    navigator.notification.confirm('Please comfirm', function(result) {
      console.log(result);
    });
  };

  $scope.beep = function() {
    navigator.notification.beep(3);
  };
})
.controller('clipboardController', function($scope) {
  $scope.copy = function(text) {
    cordova.plugins.clipboard.copy(text);
  };

  $scope.paste = function() {
    cordova.plugins.clipboard.paste(function (result) {
      $scope.$apply(function() {
        $scope.pastedText = result;
      });
    });
  };
})
.controller('flashlightController', function($scope) {
  $scope.on = function () {
    window.plugins.flashlight.switchOn();
  };
  $scope.off = function () {
    window.plugins.flashlight.switchOff();
  };
  $scope.toggle = function () {
    window.plugins.flashlight.toggle();
  };
})
.controller('networkinfoController', function($scope) {
  $scope.$watch(function() {
    return navigator.connection.type;
  }, function() {
    $scope.network = navigator.connection.type;
  });

  document.addEventListener("offline", callback, false);
  document.addEventListener("online", callback, false);

  function callback() {
    $scope.$digest();
  }
})
.controller('vibrationController', function($scope) {
  $scope.vibrate = function(duration) {
    navigator.vibrate(duration);
  };

  $scope.vibrateWithPattern = function(pattern) {
    navigator.vibrate(angular.fromJson(pattern));
  };

  $scope.cancelVibration = function() {
    navigator.vibrate(0);
  };
});
