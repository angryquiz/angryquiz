var myApp = angular.module('myApp');

myApp.controller('MenuCtrl', function ($scope, $location) {
  $scope.go = function (target) {
    $location.path(target);
  };
});

myApp.controller('MsgCtrl', function ($scope, auth) {
  $scope.message = {text: ''};
});

myApp.controller('RootCtrl', function (auth, $scope, $filter) {

  //console.log(auth);

  //Allow anonymous users
  if(auth.isAuthenticated == false) {
      auth.profile = {};
      var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss Z');
      auth.profile.name = 'anonymous';
      auth.profile.nickname = 'anonymous';
      auth.profile.email = 'email@anonymous.com';
      auth.profile.created_at = today;
      auth.profile.updated_at = today;
  }
  $scope.auth = auth;

  //$scope.nickname = 


  $scope.$watch('auth.profile.name', function(name) {
    if (!name) {
      return;
    }
    $scope.message.text = 'Welcome ' + auth.profile.nickname + '!';
  });

});


myApp.controller('LoginCtrl', function (auth, $scope, $location, store) {
  $scope.user = '';
  $scope.pass = '';

  $scope.message.text = 'Login';

  function onLoginSuccess(profile, token) {
    $scope.message.text = '';
    store.set('profile', profile);
    store.set('token', token);
    localStorage.setItem("native_token", token);
    $location.path('/');
    $scope.loading = false;
  }

  function onLoginFailed() {
    $scope.message.text = 'invalid credentials';
    $scope.loading = false;
  }

  $scope.reset = function() {
    auth.reset({
      email: 'hello@bye.com',
      password: 'hello',
      connection: 'Username-Password-Authentication'
    });
  };

  $scope.submit = function () {
	
	/*
	auth.signin({
      popup: true,
      connection: 'Username-Password-Authentication',
      scope: 'openid name email'
    }, onLoginSuccess, onLoginFailed);
	
	*/
	
	
	
	$scope.message.text = 'loading...';
    $scope.loading = true;
    auth.signin({
      connection: 'Username-Password-Authentication',
      username: $scope.user,
      password: $scope.pass,
      authParams: {
        scope: 'openid name email'
      }
    }, onLoginSuccess, onLoginFailed);
	
	
  };
  
  $scope.signin = function () {
	
	/*
	auth.signin({
      popup: true,
      connection: 'Username-Password-Authentication',
      scope: 'openid name email'
    }, onLoginSuccess, onLoginFailed);
	*/
	
	
	
	$scope.message.text = 'loading...';
    $scope.loading = true;
    auth.signin({
      connection: 'Username-Password-Authentication',
      username: $scope.user,
      password: $scope.pass,
      authParams: {
        scope: 'openid name email'
      }
    }, onLoginSuccess, onLoginFailed);
	
	
  };  

  $scope.doGoogleAuthWithPopup = function () {
    $scope.message.text = 'loading...';
    $scope.loading = true;

    auth.signin({
      popup: true,
      connection: 'google-oauth2',
      scope: 'openid name email'
    }, onLoginSuccess, onLoginFailed);
  };
  
  $scope.doSignupPopup = function () {


	auth.signup({ popup:  true, auto_login: false }, function (profile, token) {
		store.set('profile', profile);
		store.set('token', token);
    localStorage.setItem("native_token", token);
		$location.path('/');
		$scope.loading = false;
	});
  
  };

});

myApp.controller('LogoutCtrl', function (auth, $scope, $location, store) {
  auth.signout();
  //$scope.$parent.message = '';
  $scope.message.text = '';
  store.remove('profile');
  store.remove('token');
  localStorage.setItem("native_nickname", undefined);
  localStorage.setItem("native_token", undefined);
  $location.path('/login');
});

