/*jshint esnext: true */

let $rootScope;
let configuration;

class MenuToggleCtrl {
  constructor($scope, elem, attrs) {
    this.$div = angular.element(elem.children()[1]);

    this.title = attrs.menuTitle;
    this.isOpen = $rootScope.configuration.simulator[this.title + 'MenuToggle'] || false;
    this.height = this.$div.prop('scrollHeight');

    $scope.$watch(() => {
        this.height = this.$div.children().prop('clientHeight') || 0;
    });

    $scope.$watchGroup(['menu.isOpen', 'menu.height'], (arr) => {
      var open = arr[0],
          height = arr[1];

      var targetHeight = open ? height : 0;
      this.$div.css({ height: targetHeight + 'px' });
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    $rootScope.configuration.simulator[this.title + 'MenuToggle'] = this.isOpen;
    configuration.save();
  }
}

MenuToggleCtrl.$inject = ['$scope', '$element', '$attrs'];

export default class MenuToggle {
  constructor() {
    this.transclude = true;
    this.scope = true;
    this.controller = MenuToggleCtrl;
    this.controllerAs = "menu";
    this.templateUrl = 'partials/menu-toggle.html';
  }

  static directiveFactory(_$rootScope, _configuration) {
    $rootScope = _$rootScope;
    configuration = _configuration;

    MenuToggle.instance = new MenuToggle();

    return MenuToggle.instance;
  }
}

MenuToggle.directiveFactory.$inject = ['$rootScope', 'Configuration'];
