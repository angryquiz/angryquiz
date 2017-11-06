//https://scotch.io/tutorials/angularjs-best-practices-directory-structure

function quizSubmitAnswerClickStatic(event) {
  console.log(event);

  var selType = event.target.type;
  var selNumber = event.target.id;
  var selValue = event.target.value;

  var token = localStorage.getItem('native_token');
  console.log('token='+token); 
  var nickname = localStorage.getItem('native_nickname');
  console.log('nickname='+nickname);   
  var url = localStorage.getItem('native_url');
  console.log('url='+url);     
  var sessionId = localStorage.getItem('native_sessionId');
  console.log('sessionId='+sessionId);    

  console.log('selNumber='+selNumber);
  console.log('selValue='+selValue);
  console.log('selType='+selType);



  var selectedAnswers = [];
  var selectionArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  var arrayLength = selectionArray.length;  

  if(selType == 'select-one') {
      var selNumberSplit = selNumber.split("_");
      for (var i = 0; i < arrayLength; i++) {
          var idToCheck = '#' + selNumberSplit[0] + '_' + selectionArray[i];
          var idToCheckEl = angular.element(idToCheck);
          console.log(idToCheckEl);
          if (typeof(idToCheckEl[0]) == 'undefined') {
            break;
          }
          var idToCheckValue = idToCheckEl[0].value;
          console.log(idToCheckValue);

          if (typeof(idToCheckValue) != 'undefined' && idToCheckValue != null) {
            if(idToCheckValue != '' ) {
                  selectedAnswers.push(selectionArray[i]+"="+idToCheckValue); 
            }
          }
        } 
      console.log(selectedAnswers);
      var finalAns = encodeURIComponent(selectedAnswers.join(","));
      console.log(finalAns); 
      if(finalAns != '') {

      var url = url+"/rest/quiz/saveAnswer/"+finalAns+"/"+nickname+"/"+sessionId +"/"+ selNumberSplit[0];    
      $.ajax({ // ajax call starts
            url: url, // JQuery loads serverside.php
            dataType: 'json', // Choosing a JSON datatype
            headers: {'Content-Type': undefined, 'Authorization' : token},
            success: function(data) // Variable data contains the data we get from serverside
            {
              console.log(data);
            }
        });
        

      }      

      return false; // keeps the page from not refreshing 


  }

}

var myApp = angular.module('myApp');

myApp.controller('QuizCtrl', function ($filter, auth, $scope, fileUpload, submitAnswer, getResults, store) {
  $scope.answerMessage = '';
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

  //$scope.apiUrl = 'http://localhost:8080/question-rest';
  $scope.apiUrl = __env.questionCoreApiUrl;  

  //http://localhost:8080/question-rest
  //$scope.apiUrl = 'http://api.angryquiz.com/question-rest-auth';
  //$scope.apiUrl = 'https://www.mindelements.net/question-rest-auth';

  localStorage.setItem('native_url', $scope.apiUrl);

  $scope.$watch('auth.profile.name', function(name) {
    if (!name) {
      return;
    }
    
    $scope.message.text = 'Hi ' + auth.profile.nickname + '. Ready for quiz!';
    $scope.quizSubmitBtn = false;

    localStorage.setItem("native_nickname", auth.profile.nickname);


  });

  $scope.uploadFile = function() {

    var file = $scope.myFile;
    //alert(file);

    var uploadUrl = "/rest/quiz/getQuizQuestions/" + auth.profile.nickname + "/inputFile";
    fileUpload.uploadFileToUrl(file, uploadUrl, store, $scope, auth);

  };

  $scope.quizSubmitBtnClick = function() {
    //alert(1);
    //$scope.quizItems = {};
    $scope.quizSubmitBtn = false;

    var getResultsUrl = "/rest/quiz/getQuizResult/" + auth.profile.nickname + "/" + store.get('sessionId');
    getResults.getResultsToUrl(getResultsUrl, store, $scope, auth);
    $scope.answerMessage = 'Start over? Upload another file.';

  };

  $scope.quizSubmitAnswerClick = function(event) {
    var selType = event.target.type;
    var selNumber = event.target.id;
    var selValue = event.target.value;
    console.log('selNumber='+selNumber);
    console.log('selValue='+selValue);
    console.log('selType='+selType);
    console.log('elvalue='+angular.element('#'+event.target.id).val());

    var selectionArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var arrayLength = selectionArray.length;
    var selectedAnswers = [];

    if(selType == 'radio') {

      var submitAnswerUrl = "/rest/quiz/saveAnswer/" + selValue + "/" + auth.profile.nickname + "/" + store.get('sessionId') + "/" + selNumber;
      submitAnswer.submitAnswerToUrl(submitAnswerUrl, store, $scope);
      
    }

    if(selType == 'checkbox') {
      
      console.log(event.target.checked);
      var selNumberSplit = selNumber.split("_");
      for (var i = 0; i < arrayLength; i++) {
          var idToCheck = '#' + selNumberSplit[0] + '_' + selectionArray[i];
          var idToCheckEl = angular.element(idToCheck);
          console.log(idToCheckEl);
          if (typeof(idToCheckEl[0]) == 'undefined') {
            break;
          }
          var idToCheckValue = idToCheckEl[0].checked;
          console.log(idToCheckValue);

          if (typeof(idToCheckValue) != 'undefined' && idToCheckValue != null) {
            if(idToCheckValue != '' && idToCheckValue == true) {
                  selectedAnswers.push(selectionArray[i]); 
            }
          }
        }
        console.log(selectedAnswers);
        var finalAns = encodeURIComponent(selectedAnswers.join(","));
        console.log(finalAns);

        if(finalAns != '') {
          var submitAnswerUrl = "/rest/quiz/saveAnswer/" + finalAns + "/" + auth.profile.nickname + "/" + store.get('sessionId') + "/" + selNumberSplit[0];
          submitAnswer.submitAnswerToUrl(submitAnswerUrl, store, $scope);
        }
    } // end checkbox

    if(selType == 'select-one') {
        var selNumberSplit = selNumber.split("_");
        for (var i = 0; i < arrayLength; i++) {
            var idToCheck = '#' + selNumberSplit[0] + '_' + selectionArray[i];
            var idToCheckEl = angular.element(idToCheck);
            console.log(idToCheckEl);
            if (typeof(idToCheckEl[0]) == 'undefined') {
              break;
            }
            var idToCheckValue = idToCheckEl[0].value;
            console.log(idToCheckValue);

            if (typeof(idToCheckValue) != 'undefined' && idToCheckValue != null) {
              if(idToCheckValue != '' ) {
                    selectedAnswers.push(selectionArray[i]+"="+idToCheckValue); 
              }
            }
          } 
        console.log(selectedAnswers);
        var finalAns = encodeURIComponent(selectedAnswers.join(","));
        console.log(finalAns); 
        if(finalAns != '') {
          var submitAnswerUrl = "/rest/quiz/saveAnswer/" + finalAns + "/" + auth.profile.nickname + "/" + store.get('sessionId') + "/" + selNumberSplit[0];
          submitAnswer.submitAnswerToUrl(submitAnswerUrl, store, $scope);
        }         
    }
  };


});


