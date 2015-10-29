/*jshint esnext: true */

import alertTemplate from 'renderer/partials/device/dialogs-alert.html!text';
import confirmTemplate from 'renderer/partials/device/dialogs-confirm.html!text';
import promptTemplate from 'renderer/partials/device/dialogs-prompt.html!text';

import beepAudio from 'renderer/resources/beep.mp3!audio';

let $compile;
let $q;
let $rootScope;
let $timeout;

export default class Dialogs {
  static alert(sender, message, title, button) {
    var deferred = $q.defer();

    var scope = $rootScope.$new(true);
    scope.message = message;
    scope.title = title;
    scope.button = button;

    scope.close = () => {
      sender.hideWidget();
      deferred.resolve();
    };

    var element = $compile(alertTemplate)(scope);
    scope.$digest();

    sender.showWidget(element, {left: '50%', top: '50%',transform: 'translate(-50%,-50%)'}, true, scope.close);

    return deferred.promise;
  }

  static confirm(sender, message, title, buttons) {
    var deferred = $q.defer();

    var scope = $rootScope.$new(true);
    scope.message = message;
    scope.title = title;
    scope.buttons = buttons.split(',');

    scope.close = (btnIndex) => {
      sender.hideWidget();
      deferred.resolve(btnIndex || 0);
    };

    var element = $compile(confirmTemplate)(scope);
    scope.$digest();

    sender.showWidget(element, {left: '50%', top: '50%',transform: 'translate(-50%,-50%)'}, true, scope.close);

    return deferred.promise;
  }

  static prompt(sender,message, title, buttons, defaultText) {
    var deferred = $q.defer();

    var scope = $rootScope.$new(true);
    scope.message = message;
    scope.title = title;
    scope.buttons = buttons;
    scope.defaultText = defaultText;

    scope.close = (btnIndex, text) => {
      sender.hideWidget();
      deferred.resolve({buttonIndex: btnIndex || 0, input1: text});
    };

    var element = $compile(promptTemplate)(scope);
    scope.$digest();

    sender.showWidget(element, {left: '50%', top: '50%',transform: 'translate(-50%,-50%)'}, true, scope.close);

    return deferred.promise;
  }

  static beep(times) {
    function play() {
        beepAudio.play();
        times--;
        if (times > 0) {
         $timeout(play, 500);
        }
    }

    if (times > 0) {
        play();
    }
  }

  static factory(_$rootScope, _$q, _$compile, _$timeout) {
    $q = _$q;
    $rootScope = _$rootScope;
    $compile = _$compile;
    $timeout = _$timeout;
  }
}

Dialogs.factory.$inject = ['$rootScope', '$q', '$compile', '$timeout'];
