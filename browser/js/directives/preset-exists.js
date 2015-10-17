/*jshint esnext: true */

let $parse;
let configuration;

export default class PresetExists {
  constructor() {
    this.require = 'ngModel';
  }

  link(scope, elem, attrs, ctrl) {
    ctrl.$validators.presetExists = function(modelValue, viewValue) {
      return $parse(attrs.ngDisabled)(scope) || !configuration.isPresetExists(modelValue);
    };
  }

  static directiveFactory(_$parse, _configuration) {
    $parse = _$parse;
    configuration = _configuration;

    PresetExists.instance = new PresetExists();

    return PresetExists.instance;
  }
}

PresetExists.directiveFactory.$inject = ['$parse', 'Configuration'];
