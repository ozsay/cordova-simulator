/*jshint esnext: true */

let $parse;

export default class Drop {
  link(scope, elem, attrs) {
    var fn = $parse(attrs.drop);
    elem.on('dragenter', (event) => {
      if (document.elementsFromPoint(event.x, event.y).indexOf(elem[0]) !== -1) {
        elem.addClass('dropped');
      }
    });

    elem.on('dragleave', (event) => {
      if (document.elementsFromPoint(event.x, event.y).indexOf(elem[0]) === -1) {
        elem.removeClass('dropped');
      }
    });

    elem.on('dragover', (event) => {
      event.preventDefault();
    });

    elem.on('drop', (event) => {
      event.preventDefault();

      elem.removeClass('dropped');

      scope.$apply(() => {
        fn(scope, {data: event.dataTransfer.getData('dragData'), files: event.dataTransfer.files});
      });
    });
  }

  static directiveFactory(_$parse) {
    $parse = _$parse;

    Drop.instance = new Drop();

    return Drop.instance;
  }
}

Drop.directiveFactory.$inject = ['$parse'];
