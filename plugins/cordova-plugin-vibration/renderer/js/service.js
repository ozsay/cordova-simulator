/*jshint esnext: true */

let $timeout;

let plugins;

export default class VibrationPlugin {
  constructor(_$timeout, _plugins) {
    $timeout = _$timeout;

    plugins = _plugins;

    plugins.registerCommand('Vibration', 'vibrate', this.vibrate);
    plugins.registerCommand('Vibration', 'cancelVibration', this.cancelVibration);
    plugins.registerCommand('Vibration', 'vibrateWithPattern', this.vibrateWithPattern);
  }

  vibrate(sender, duration) {
    sender.device.vibrate(sender, duration);
  }

  cancelVibration(sender) {
    sender.device.cancelVibration(sender);
  }

  vibrateWithPattern(sender, pattern, repeat) {
    sender.device.cancelVibration(sender);

    repeat = repeat === -1 ? 1 : repeat;

    var i = 0,
        j = 0;

    function calcNext() {
        if (j < repeat) {
            if (i < (pattern.length)) {
                return pattern[i++];
            } else {
                j++;
                i=0;
                return calcNext();
            }
        } else {
            return -1;
        }
    }

    function wait(duration) {
        var next = calcNext();

        sender.vibration = $timeout(() => {
            if (next !== -1) {
                vib(next);
            }
        }, duration);
    }

    function vib(duration) {
      sender.device.vibrate(sender, duration, () => {
        var next = calcNext();
        if (next !== -1) {
            wait(next);
        }
      });
    }

    vib(calcNext());
  }
}

VibrationPlugin.$inject = ['$timeout', 'plugins'];
