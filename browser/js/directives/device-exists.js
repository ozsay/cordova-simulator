/*jshint esnext: true */

let $parse;
let $rootScope;

export default class DeviceExists {
  constructor() {
    this.require = 'ngModel';
  }

  link(scope, elem, attrs, ctrl) {
    ctrl.$validators.deviceExists = function(modelValue, viewValue) {
      return $parse(attrs.ngDisabled)(scope) || $rootScope.configuration.devices[modelValue] === undefined;
    };
  }

  static directiveFactory(_$parse, _$rootScope) {
    $parse = _$parse;
    $rootScope = _$rootScope;

    DeviceExists.instance = new DeviceExists();

    return DeviceExists.instance;
  }
}

DeviceExists.directiveFactory.$inject = ['$parse', '$rootScope'];
