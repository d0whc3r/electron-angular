(function() {
  'use strict';

  angular.module('electronApp')
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('about', {
          url: '/about',
          templateUrl: 'scripts/aboutpage/about.tpl.html',
          controller: 'AboutCtrl',
          controllerAs: 'about'
        });
    }]);

})();
