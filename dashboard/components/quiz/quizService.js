var myApp = angular.module('myApp');

myApp.service('fileUpload', ['$http', 'AQService', function ($http, AQService) {


  this.uploadFileToUrl = function(file, uploadUrl, store, $scope, auth){
 
    $scope.message.text = 'Hi ' + auth.profile.nickname + '. Ready for quiz!';

    $scope.answerMessage = '';

     var fd = new FormData();
     fd.append('inputFile', file);
  
      console.log(store.get('token'));
     
     $http.put($scope.apiUrl + uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined, 'Authorization' : store.get('token')}
     })
  
     .success(function(data, status, headers, config){
        console.log(data);

        /*
        angular.forEach(data, function(item){
           console.log(item.sessionId);  
        });
        */

        for (var i = 0, len = data.length; i < len; i++) {
          if (i === 1) {
            //get session id
            console.log(data[i].sessionId); 
            store.set('sessionId', data[i].sessionId);
            localStorage.setItem('native_sessionId',data[i].sessionId);
          }
          if(data[i].answersMap != undefined) {
            data[i].arrayOfAnswerMap = AQService.shuffleMap(data[i].answersMap);
          }

          if(data[i].questionsMap != undefined) {
            data[i].arrayOfQuestionsMap = AQService.shuffleMap(data[i].questionsMap);
          }          
          
          if(data[i].selection != undefined) {
            data[i].arrayOfSelection = AQService.shuffleMap(data[i].selection);
          }

          console.log(data);
        }


        //http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript


        $scope.quizSubmitBtn = true;

        $scope.quizItems = data;

     })
  
     .error(function(data, status, headers, config){

       $scope.apiError = true;

       if(data.errorDescription == undefined) {
           $scope.apiErrorMessage = data;
       } else {
           $scope.apiErrorMessage = data.errorDescription;
       }
      
      $scope.quizItems = {};



      console.log(data);
     });
  }
}]);


