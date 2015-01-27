'use strict';

angular.module('cordovaSimulator.filters', [])
.filter('phoneOrientation', [function() {
    return function(input, width, height, isLandscape) {
        if (isLandscape)
            return {
                width: height,
                height: width
            };
        else return {
                width: width,
                height: height
            };
    }
}]);