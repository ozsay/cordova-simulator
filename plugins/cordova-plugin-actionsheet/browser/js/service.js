/*jshint esnext: true */

import '../css/plugin.css!';
import template from '../partials/actionsheet.html!text';

let $compile;
let $q;
let $rootScope;

let plugins;

export default class ActionSheetPlugin {
  constructor(_$rootScope, _$q, _$compile, _plugins) {
    $q = _$q;
    $rootScope = _$rootScope;
    $compile = _$compile;

    plugins = _plugins;

    plugins.registerCommand('ActionSheet', 'show', this.show);
    plugins.registerCommand('ActionSheet', 'hide', this.hide);
  }

  show(sender, options) {
    var deferred = $q.defer();

    var scope = $rootScope.$new(true);

    Object.assign(scope, options);
    scope.platform = sender.device.preset.platform;

    scope.close = (btnIndex) => {
      sender.hideWidget();
      deferred.resolve(btnIndex);
    };

    var element = $compile(template)(scope);
    scope.$digest();

    if (scope.platform === 'android') {
      sender.showWidget(element, {left: '50%', top: '50%',transform: 'translate(-50%,-50%)'}, true);
    } else {
      sender.showWidget(element, {left: '50%', bottom: '0',transform: 'translate(-50%,0)', 'margin-bottom': '10px'}, true);
    }

    return deferred.promise;
  }

  hide(sender) {
    sender.hideWidget();
  }
}

ActionSheetPlugin.$inject = ['$rootScope', '$q', '$compile', 'plugins'];
