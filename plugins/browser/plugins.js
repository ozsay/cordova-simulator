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

  destroy(sender) {
    angular.forEach(customFeatures, (customFeature) => {
      if (customFeature.destroy !== undefined) {
        customFeature.destroy(sender);
      }
    });
  }

  registerCustomFeature(name, customFeature) {
    customFeatures[name] = customFeature;
  }

  execCustomFeatures(sender) {
    angular.forEach(customFeatures, (customFeature) => {
      customFeature.exec(sender);
    });
  }

  registerCommand(plugin, method, fn) {
    if (pluginsList[plugin] === undefined) {
        pluginsList[plugin] = {};
    }

    pluginsList[plugin][method] = fn;
  }

  execCommand(sender, plugin, method, args) {
    var result = pluginsList[plugin][method](sender, ...args);

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
