(function() {
  'use strict';

  angular.module('electronApp')
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('main', {
          url: '/',
          templateUrl: 'scripts/mainpage/main.tpl.html',
          controller: 'MainCtrl',
          controllerAs: 'main'
        });
    }]);

})();
