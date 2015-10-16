/*jshint esnext: true */

let $q;
let pluginsList;

export default class Plugins {
  constructor(_$q) {
    pluginsList = {};
    $q = _$q;
  }

  registerCommand(plugin, method, fn) {
    if (pluginsList[plugin] === undefined) {
        pluginsList[plugin] = {};
    }

    pluginsList[plugin][method] = fn;
  }

  execCommand(sender, plugin, method, args) {
    var result = pluginsList[plugin][method](sender, args);

    if (result === undefined || !angular.isFunction(result.then)) {
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    } else {
      return result;
    }
  }
}

Plugins.$inject = ['$q'];