(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name electronApp
   * @description
   * # electronApp
   *
   * Main module of the application.
   */
  angular
    .module('electronApp', [
      'ngAnimate',
      'ngAria',
      'ngCookies',
      'ngMessages',
      'ngResource',
      'ui.router',
      'ngSanitize',
      'ngMaterial',
      'pascalprecht.translate',
      'RecursionHelper',
      'lfNgMdFileInput',
      'LocalStorageModule',
      'ngNotify',
      'tmh.dynamicLocale',
      'ui.bootstrap',
      'smart-table'
    ])
    .run(['$rootScope', '$state', '$stateParams',
      function($rootScope, $state, $stateParams) {
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }
    ])
    .run(['ngNotify', function(ngNotify) {
      ngNotify.config({
        theme: 'pastel',
        position: 'top',
        duration: 3700,
        type: 'info',
        sticky: false,
        button: true,
        html: false
      });
    }])
    .config(['$translateProvider', '$rootScopeProvider', 'localStorageServiceProvider', 'tmhDynamicLocaleProvider', '$mdThemingProvider', '$urlRouterProvider', '$logProvider',
      function($translateProvider, $rootScopeProvider, localStorageServiceProvider, tmhDynamicLocaleProvider, $mdThemingProvider, $urlRouterProvider, $logProvider) {
        $logProvider.debugEnabled(true);
        var prefered = $translateProvider.use() || $translateProvider.preferredLanguage() || 'es';
        var transpath = 'i18n/';
        var transprefix = 'locale_parse-';
        var transsuffix = '.json';
        $translateProvider
          .useSanitizeValueStrategy('escapeParameters')
          .useStaticFilesLoader({
            prefix: transpath + transprefix,
            suffix: transsuffix
          })
          .useLocalStorage()
          .preferredLanguage(prefered);

        tmhDynamicLocaleProvider
          .localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js')
          .defaultLocale(prefered);

        localStorageServiceProvider
          .setPrefix('electronapp_')
          .setStorageCookie(0, '/');

        $mdThemingProvider.alwaysWatchTheme(true);

        $urlRouterProvider.otherwise('/');
      }
    ]);

})();
