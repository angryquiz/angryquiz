var myApp = angular.module('myApp');

myApp.service('questionBankService', ['$http', 'AQService', function ($http, AQService) {


  this.uploadQuestionList = function(file, uploadUrl, store, $scope, auth){
 
    $scope.message.text = 'Hi ' + auth.profile.nickname + '. Upload question set!';

     var fd = new FormData();
     fd.append('questionFile', file);
  
      //console.log(store.get('token'));
     
     $http.put( $scope.questionBankApiUrl + uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined, 'Authorization' : store.get('token')}
     })
  
     .success(function(data, status, headers, config){
        //console.log(data);
        //console.log(status);
        $scope.showUploadQuestionListMessage = true;
        $scope.uploadQuestionListStatus = 'File is uploaded. You may upload another. Or, start searching question set.';

     })
  
     .error(function(data, status, headers, config){
         alert('Unexpected error occurred.' + status);
     });
  };


  this.searchQuestionBank = function(toUrl, store, $scope){
     $scope.loadingSpinner = 'Loading...';
     $http.get( $scope.questionBankApiUrl + toUrl, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined, 'Authorization' : store.get('token')}
     })
     .success(function(data, status, headers, config){
        //console.log(data);

        $scope.questionBanks = data.hits.hits;
        //console.log($scope.questionBanks);

        $scope.loadingSpinner = '';

     })
     .error(function(data, status, headers, config){
         alert('Unexpected error occurred.' + status);
     });
  };





}]);
