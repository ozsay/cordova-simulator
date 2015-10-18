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
  }
})
.controller('deviceController', function($scope) {
  $scope.device = device;
});
