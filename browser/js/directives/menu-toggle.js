/*jshint esnext: true */

export default class MenuToggle {
  constructor() {
    this.transclude = true;
    this.scope = true;
    this.templateUrl = 'partials/menu-toggle.html';
  }

  link(scope, elem, attrs) {
    var $div = angular.element(elem.children()[1]);

    scope.title = attrs.menuTitle;
    scope.isOpen = false;
    scope.height = $div.prop('scrollHeight');

    scope.toggle = () => scope.isOpen = !scope.isOpen;

    scope.$watch(() => {
        scope.height = $div.children().prop('clientHeight') || 0;
    });

    scope.$watchGroup(['isOpen', 'height'], (arr) => {
      var open = arr[0],
          height = arr[1];

      var targetHeight = open ? height : 0;
      $div.css({ height: targetHeight + 'px' });
    });
  }

  static directiveFactory() {
    MenuToggle.instance = new MenuToggle();

    return MenuToggle.instance;
  }
}

//MenuToggle.directiveFactory.$inject = [];
