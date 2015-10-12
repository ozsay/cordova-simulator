/*jshint esnext: true */

let $parse;

export default class RightClick {
  link(scope, elem, attrs) {
    var fn = $parse(attrs.rightClick);
    elem.bind('contextmenu', (event) => {
      scope.$apply(() => {
        event.preventDefault();
        fn(scope, {$event:event});
      });
    });
  }

  static directiveFactory(_$parse) {
    $parse = _$parse;

    RightClick.instance = new RightClick();

    return RightClick.instance;
  }
}

RightClick.directiveFactory.$inject = ['$parse'];
