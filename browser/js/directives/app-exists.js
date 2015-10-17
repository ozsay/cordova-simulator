/*jshint esnext: true */

let $parse;
let configuration;

export default class AppExists {
  constructor() {
    this.require = 'ngModel';
  }

  link(scope, elem, attrs, ctrl) {
    if (!$parse(attrs.ngDisabled)(scope)) {
      ctrl.$validators.appExists = function(modelValue, viewValue) {
        return !configuration.isAppExists(modelValue);
      };
    }
  }

  static directiveFactory(_$parse, _configuration) {
    $parse = _$parse;
    configuration = _configuration;

    AppExists.instance = new AppExists();

    return AppExists.instance;
  }
}

AppExists.directiveFactory.$inject = ['$parse', 'Configuration'];
