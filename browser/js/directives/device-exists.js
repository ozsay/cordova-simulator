/*jshint esnext: true */

let $parse;
let configuration;

export default class DeviceExists {
  constructor() {
    this.require = 'ngModel';
  }

  link(scope, elem, attrs, ctrl) {
    ctrl.$validators.deviceExists = function(modelValue, viewValue) {
      return $parse(attrs.ngDisabled)(scope) || !configuration.isDeviceExists(modelValue);
    };
  }

  static directiveFactory(_$parse, _configuration) {
    $parse = _$parse;
    configuration = _configuration;

    DeviceExists.instance = new DeviceExists();

    return DeviceExists.instance;
  }
}

DeviceExists.directiveFactory.$inject = ['$parse', 'Configuration'];
