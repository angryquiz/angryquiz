//http://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/
var env = {};
// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}
// end config setup

var myApp = angular.module('myApp', [
  'ngCookies', 'auth0', 'ngRoute', 'angular-storage', 'angular-jwt', 'ngDialog'
]);

// Register environment in AngularJS as constant
myApp.constant('__env', env);

myApp.config(function ($routeProvider, authProvider, $httpProvider,
  $locationProvider, jwtInterceptorProvider, jwtOptionsProvider) {
  $routeProvider
  .when('/logout',  {
    templateUrl: '/dashboard/views/logout.html',
    controller: 'LogoutCtrl'
  })
  .when('/login',   {
    templateUrl: '/dashboard/views/login.html',
    controller: 'LoginCtrl'
  })
  .when('/', {
    templateUrl: '/dashboard/views/root.html',
    controller: 'RootCtrl'
    /* isAuthenticated will prevent user access to forbidden routes */
    //requiresLogin: true
  })

    //   .when('/quiz', {
    // templateUrl: '/dashboard/components/quiz/quizView.html',
    // controller: 'QuizCtrl'
    // })

      .when('/quizMe/:questionSetNum/:questionName', {
    templateUrl: '/dashboard/components/quizMe/quizMeView.html',
    controller: 'QuizMeCtrl'
  /* isAuthenticated will prevent user access to forbidden routes */
    //requiresLogin: true
   })

      .when('/memorizeIt/:questionSetNum/:questionName', {
          templateUrl: '/dashboard/components/memorizeIt/memorizeItView.html',
          controller: 'MemorizeItCtrl'
        /* isAuthenticated will prevent user access to forbidden routes */
          //requiresLogin: true
      })

      .when('/memorize', {
    templateUrl: '/dashboard/components/memorize/memorizeView.html',
    controller: 'MemorizeCtrl'
    /* isAuthenticated will prevent user access to forbidden routes */
    //requiresLogin: true
  })



      .when('/questionBank', {
    templateUrl: '/dashboard/components/questionBank/questionBankView.html',
    controller: 'QuestionBankCtrl'
  }).when('/questionBankSearch', {
    templateUrl: '/dashboard/components/questionBank/questionBankSearchView.html',
    controller: 'QuestionBankSearchCtrl'
  }).when('/questionBankCreate', {
    templateUrl: '/dashboard/components/questionBankCreate/questionBankCreateView.html',
    controller: 'QuestionBankCreateCtrl'
  });


  $locationProvider.hashPrefix('!');

    authProvider.init({
      domain: 'angryquiz.auth0.com',
      clientID: 'Zx5wvx3nqWVFhOMdDc3oshq5XnlxVnPm',
      loginUrl: '/login'
    });

  jwtInterceptorProvider.tokenGetter = function(store) {
    return store.get('token');
  };

  jwtOptionsProvider.config({
      whiteListedDomains: ['www.angryquiz.com', 'localhost']
  });


  // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
  // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
  // want to check the delegation-token example
  $httpProvider.interceptors.push('jwtInterceptor');
}).run(function($rootScope, auth, store, jwtHelper, $location) {
  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          $location.path('/login');
        }
      }
    }

  });
});
