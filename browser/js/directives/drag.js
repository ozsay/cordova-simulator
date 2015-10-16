/*jshint esnext: true */

export default class Drag {
  link(scope, elem, attrs) {
    elem.attr('draggable', true);

    elem.on('dragstart', (event) => {
      elem.addClass('dragged');

      event.dataTransfer.effectAllowed = attrs.dragEffect;
      event.dataTransfer.setData("dragData", attrs.dragData);
    });

    elem.on('dragend', (event) => {
      elem.removeClass('dragged');
    });
  }

  static directiveFactory() {
    Drag.instance = new Drag();

    return Drag.instance;
  }
}

//Drag.directiveFactory.$inject = [];
