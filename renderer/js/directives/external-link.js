/*jshint esnext: true */

var shell = require('shell');

export default class ExternalLink {
  constructor() {
    this.restrict = 'A';
  }

  link(scope, elem, attrs) {
    elem.on('click', (event) => {
      event.preventDefault();

      shell.openExternal(attrs.href);
    });
  }

  static directiveFactory() {
    ExternalLink.instance = new ExternalLink();

    return ExternalLink.instance;
  }
}

//ExternalLink.directiveFactory.$inject = [];
