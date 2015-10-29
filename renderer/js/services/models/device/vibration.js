/*jshint esnext: true */

let $timeout;

export default class Vibration {
  static vibrate(sender, duration, cb) {
    cb = cb || angular.noop;
    if (sender.vibration !== undefined) {
        $timeout.cancel(sender.vibration);
    }

    sender.elem.addClass("shake shake-constant");

    sender.vibration = $timeout(() => {
        sender.elem.removeClass("shake shake-constant");
        cb();
    }, duration);
  }

  static cancelVibration(sender) {
    if (sender.vibration !== undefined) {
        $timeout.cancel(sender.vibration);
        sender.elem.removeClass("shake shake-constant");
    }
  }

  static factory(_$timeout) {
    $timeout = _$timeout;
  }
}

Vibration.factory.$inject = ['$timeout'];
