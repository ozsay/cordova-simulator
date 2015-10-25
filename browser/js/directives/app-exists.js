/*jshint esnext: true */

let $parse;
let $rootScope;

export default class AppExists {
  constructor() {
    this.require = 'ngModel';
  }

  link(scope, elem, attrs, ctrl) {
    if (!$parse(attrs.ngDisabled)(scope)) {
      ctrl.$validators.appExists = function(modelValue, viewValue) {
        return $rootScope.configuration.apps[modelValue] === undefined;
      };
    }
  }

  static directiveFactory(_$parse, _$rootScope) {
    $parse = _$parse;
    $rootScope = _$rootScope;

    AppExists.instance = new AppExists();

    return AppExists.instance;
  }
}

AppExists.directiveFactory.$inject = ['$parse', '$rootScope'];
