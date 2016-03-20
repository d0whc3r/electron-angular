'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */

angular.module('appApp')
  .controller('MainCtrl', ['$scope', '$interval', function($scope, $interval) {
    $scope.mainWindow;
    $scope.getClosed = function() {
      return $scope.checkClosed() ? 'Not open' : 'Open';
    };
    let stop;
    const loadingClass = 'loadingbody';
    $scope.checkClosed = function() {
      return (!$scope.mainWindow || $scope.mainWindow.closed);
    };
    $scope.stopCheck = function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
        if (loadingClass) {
          angular.element('body').removeClass(loadingClass);
        }
      }
    };
    $scope.newwin = function() {
      if (loadingClass) {
        angular.element('body').addClass(loadingClass);
      }
      $scope.mainWindow = window.open('index.html');
      stop = $interval(function() {
        let closed = $scope.checkClosed();
        if (closed) {
          $scope.stopCheck();
        }
      }, 200);
    };
    $scope.$on('$destroy', function() {
      $scope.stopCheck();
    });
  }]);