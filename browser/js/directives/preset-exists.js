/*jshint esnext: true */

let $parse;
let $rootScope;

export default class PresetExists {
  constructor() {
    this.require = 'ngModel';
  }

  link(scope, elem, attrs, ctrl) {
    ctrl.$validators.presetExists = function(modelValue, viewValue) {
      return $parse(attrs.ngDisabled)(scope) || $rootScope.configuration.presets[modelValue] === undefined;
    };
  }

  static directiveFactory(_$parse, _$rootScope) {
    $parse = _$parse;
    $rootScope = _$rootScope;

    PresetExists.instance = new PresetExists();

    return PresetExists.instance;
  }
}

PresetExists.directiveFactory.$inject = ['$parse', '$rootScope'];
