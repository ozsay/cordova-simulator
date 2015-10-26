/*jshint esnext: true */

let $q;
let pluginsList;
let customFeatures;

export default class Plugins {
  constructor(_$q) {
    $q = _$q;

    pluginsList = {};
    customFeatures = {};
  }

  registerCommand(plugin, method, fn, keepRequest) {
    if (pluginsList[plugin] === undefined) {
        pluginsList[plugin] = {};
    }

    pluginsList[plugin][method] = {fn: fn, keepRequest: keepRequest};
  }

  execCommand(sender, request, plugin, method, args) {
    var result;

    if (pluginsList[plugin][method].keepRequest) {
      result = pluginsList[plugin][method].fn(sender, request, ...args);
    } else {
      result = pluginsList[plugin][method].fn(sender, ...args);
    }

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
