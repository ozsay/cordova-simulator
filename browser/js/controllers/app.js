/*jshint esnext: true */

export default class AppCtrl {
    constructor($timeout) {
      $timeout(() => {
        this.appReady = true;
      }, 1000);
    }
}

AppCtrl.$inject = ['$timeout'];
