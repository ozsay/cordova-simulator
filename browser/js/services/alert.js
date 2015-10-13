/*jshint esnext: true */

let $mdToast;

export default class Alert {
  constructor(_$mdToast) {
    $mdToast = _$mdToast;
  }

  error(message) {
    $mdToast.show($mdToast.simple().content(message).position('top right').capsule(true).hideDelay(false).action('ok'));
  }

  warning(message) {
    $mdToast.show($mdToast.simple().content(message).position('top right').capsule(true).hideDelay(3500));
  }

  info(message) {
    $mdToast.show($mdToast.simple().content(message).position('top right').capsule(true).hideDelay(2500));
  }
}

Alert.$inject = ['$mdToast'];
