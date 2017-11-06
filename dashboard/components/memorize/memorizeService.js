//http://viralpatel.net/blogs/angularjs-service-factory-tutorial/

var myApp = angular.module('myApp');

myApp.service('memorizeService', ['$http', 'AQService', function ($http, AQService) {


  this.getFirstQuestionUsingFile = function(file, uploadUrl, store, $scope, auth){

    $scope.message.text = 'Hi ' + auth.profile.nickname + '. Good luck!';

     var fd = new FormData();
     fd.append('inputFile', file);
  
      console.log(store.get('token'));
     
     $http.put($scope.apiUrl + uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined, 'Authorization' : store.get('token')}
     })
  
     .success(function(data, status, headers, config){

        console.log(data);

        var singleData = [data];

        for (var i = 0, len = singleData.length; i < len; i++) {

          //get session id
          console.log(singleData[i].sessionId); 
          store.set('sessionId', singleData[i].sessionId);
          localStorage.setItem('native_sessionId',singleData[i].sessionId);

          if(singleData[i].answersMap != undefined) {
            singleData[i].arrayOfAnswerMap = AQService.shuffleMap(singleData[i].answersMap);
          }

          if(singleData[i].questionsMap != undefined) {
            singleData[i].arrayOfQuestionsMap = AQService.shuffleMap(singleData[i].questionsMap);
          }          
          
          if(singleData[i].selection != undefined) {
            singleData[i].arrayOfSelection = AQService.shuffleMap(singleData[i].selection);
          }

        }


        $scope.memorizeItems = singleData;
        $scope.memorizeReadOnlyItems = [];

        $scope.memorizeCheckAnswerBtn = false;
        $scope.memorizeNextQuetionBtn = false;

     })
  
     .error(function(data, status, headers, config){

      console.log(data);

     });
  };



}]);



