/*jshint esnext: true */

export default class Alert {
  constructor($mdToast) {
    this.$mdToast = $mdToast;
  }

  error(message) {
    this.$mdToast.show(this.$mdToast.simple().content(message).position('top right').capsule(true).hideDelay(false).action('ok'));
  }

  warning(message) {
    this.$mdToast.show(this.$mdToast.simple().content(message).position('top right').capsule(true).hideDelay(3500));
  }

  info(message) {
    this.$mdToast.show(this.$mdToast.simple().content(message).position('top right').capsule(true).hideDelay(2500));
  }
}

Alert.$inject = ['$mdToast'];
