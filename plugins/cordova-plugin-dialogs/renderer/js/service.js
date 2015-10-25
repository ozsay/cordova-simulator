/*jshint esnext: true */

import '../css/plugin.css!';
import alertTemplate from '../partials/dialogs-alert.html!text';
import confirmTemplate from '../partials/dialogs-confirm.html!text';
import promptTemplate from '../partials/dialogs-prompt.html!text';

let $compile;
let $q;
let $rootScope;
let $timeout;

let plugins;

export default class DialogsPlugin {
  constructor(_$rootScope, _$q, _$compile, _$timeout, _plugins) {
    $q = _$q;
    $rootScope = _$rootScope;
    $compile = _$compile;
    $timeout = _$timeout;

    plugins = _plugins;

    plugins.registerCommand('Notification', 'alert', this.alert);
    plugins.registerCommand('Notification', 'beep', this.beep);
    plugins.registerCommand('Notification', 'confirm', this.confirm);
    plugins.registerCommand('Notification', 'prompt', this.prompt);
  }

  alert(sender, message, title, button) {
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

  confirm(sender, message, title, buttons) {
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

  prompt(sender,message, title, buttons, defaultText) {
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

  beep(sender, times) {
    var audio = new Audio('../plugins/cordova-plugin-dialogs/resources/beep.mp3');

    function play() {
        audio.play();
        times--;
        if (times > 0) {
         $timeout(play, 500);
        }
    }

    if (times > 0) {
        play();
    }
  }
}

DialogsPlugin.$inject = ['$rootScope', '$q', '$compile', '$timeout', 'plugins'];
