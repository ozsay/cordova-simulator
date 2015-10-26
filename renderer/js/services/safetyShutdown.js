/*jshint esnext: true */

let $q;

export default class SafetyShutdown {
  constructor(_$q) {
    $q = _$q;

    this.actions = [];
  }

  register(fn) {
    this.actions.push(fn);
  }

  exec() {
    var promises = [];

    angular.forEach(this.actions, (action) => {
      var res = action();

      if (res !== undefined && res.then !== undefined) {
        promises.push(res);
      }
    });

    return $q.all(promises);
  }
}

SafetyShutdown.$inject = ['$q'];
