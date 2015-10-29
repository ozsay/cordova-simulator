/*jshint esnext: true */

import template from 'renderer/partials/device/actionsheet.html!text';

let $compile;
let $q;
let $rootScope;

export default class ActionSheet {
  static show(sender, options) {
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

  static hide(sender) {
    sender.hideWidget();
  }

  static factory(_$rootScope, _$q, _$compile) {
    $q = _$q;
    $rootScope = _$rootScope;
    $compile = _$compile;
  }
}

ActionSheet.factory.$inject = ['$rootScope', '$q', '$compile'];
