
//memorize question addtl

var staticEvent = null;


function memorizeCheckAnswerBtnSelectOneClick() {

  if(staticEvent != null ) {
    memorizeSubmitAnswerClickStatic(staticEvent, true);
  }
  
}


function memorizeSubmitAnswerClickStatic(event, fromButtonClick) {
  //console.log(event);

  staticEvent = event;

  var selType = event.target.type;
  var selNumber = event.target.id;
  var selValue = event.target.value;

  var token = localStorage.getItem('native_token');
  //console.log('token='+token);
  var nickname = localStorage.getItem('native_nickname');
  //console.log('nickname='+nickname);
  var url = localStorage.getItem('native_url');
  //console.log('url='+url);
  var sessionId = localStorage.getItem('native_sessionId');
  //console.log('sessionId='+sessionId);

  //console.log('selNumber='+selNumber);
  //console.log('selValue='+selValue);
  //console.log('selType='+selType);

  

  if(fromButtonClick == true) {
    $("#memorizeCheckAnswerBtnSelectOne").addClass('ng-hide');
  } else {
    $("#memorizeCheckAnswerBtnSelectOne").removeClass('ng-hide');
  }

  var selectedAnswers = [];
  var selectionArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  var arrayLength = selectionArray.length;  

  if(selType == 'select-one') {
      var selNumberSplit = selNumber.split("_");
      for (var i = 0; i < arrayLength; i++) {
          var idToCheck = '#' + selNumberSplit[0] + '_' + selectionArray[i];
          var idToCheckEl = angular.element(idToCheck);
          //console.log(idToCheckEl);
          if (typeof(idToCheckEl[0]) == 'undefined') {
            break;
          }
          var idToCheckValue = idToCheckEl[0].value;
          //console.log(idToCheckValue);

          if (typeof(idToCheckValue) != 'undefined' && idToCheckValue != null) {
            if(idToCheckValue != '' ) {
                  selectedAnswers.push(selectionArray[i]+"="+idToCheckValue); 
            }
          }
        } 
      //console.log(selectedAnswers);
      var finalAns = encodeURIComponent(selectedAnswers.join(","));
      //console.log(finalAns);
      if(finalAns != '' && fromButtonClick == true ) {

      var url = url+"/rest/questions/checkAnswer/"+finalAns+"/"+nickname+"/"+sessionId +"/"+ selNumberSplit[0];    
      $.ajax({ // ajax call starts
            url: url, // JQuery loads serverside.php
            dataType: 'json', // Choosing a JSON datatype
            headers: {'Content-Type': undefined, 'Authorization' : token},
            success: function(data) // Variable data contains the data we get from serverside
            {
              //console.log(data);
              if(fromButtonClick == true) {
                $('#answerSelectOne').text(data.answer);
                $("#memorizeNextQuetionBtn").removeClass('ng-hide');
              }

            }
        });
        

      }      

      return false; // keeps the page from not refreshing 


  }

}


//https://scotch.io/tutorials/angularjs-best-practices-directory-structure
var myApp = angular.module('myApp');

myApp.controller('QuestionBankCtrl', function ($filter, auth, $scope, questionBankService, store) {
  

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

  //$scope.questionBankApiUrl = 'http://52.91.181.51:8585/QuestionBankApp';
  
  //$scope.questionBankApiUrl = 'http://localhost:8888/QuestionBankApp';
  //$scope.apiUrl = 'http://localhost:8080/question-rest';

  $scope.questionBankApiUrl = __env.questionBankApiUrl;
  $scope.apiUrl = __env.questionCoreApiUrl;

  localStorage.setItem('native_url', $scope.apiUrl);

  $scope.owner = auth.profile.nickname;

  $scope.$watch('auth.profile.name', function(name) {
    if (!name) {
      return;
    }
    
    $scope.message.text = 'Hi ' + auth.profile.nickname + '. Share your question set by uploading it!';
    $scope.quizSubmitBtn = false;

    localStorage.setItem("native_nickname", auth.profile.nickname);


  });

  $scope.uploadQuestionList = function() {

    var file = $scope.myFile;
    var questionName = $scope.questionName;
    var questionTag = $scope.questionTag;

    var uploadUrl = '/rest/question-bank/upload/' + $scope.owner + '/' + questionName + '/' + questionTag;
    //console.log(uploadUrl);

    questionBankService.uploadQuestionList(file, uploadUrl, store, $scope, auth);

  };

});


myApp.controller('QuestionBankSearchCtrl', function ($route, $filter, auth, $scope, questionBankService, store, $location) {
  
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
  $scope.showSearchScreen = true;

  $scope.questionBankApiUrl = __env.questionBankApiUrl;
  $scope.apiUrl = __env.questionCoreApiUrl;

  localStorage.setItem('native_url', $scope.apiUrl);

  $scope.$watch('auth.profile.name', function(name) {
    if (!name) {
      return;
    }
    
    $scope.message.text = 'Hi ' + auth.profile.nickname + '. Search question sets!';
    $scope.quizSubmitBtn = false;

    localStorage.setItem("native_nickname", auth.profile.nickname);

  });

    // --------------- Search Button

    $scope.searchBtnClick = function() {

        $scope.showSearchScreenResults = true;
        var query = $scope.query;
        //console.log(query);

        var uploadUrl = '/rest/question-bank/search/summary/'+query;
        //console.log(uploadUrl);
        questionBankService.searchQuestionBank(uploadUrl, store, $scope, auth);

    };

  // ----------------------- Memorize Question

    $scope.memorizeItClicked = function(selectedItem) {
        //console.log(selectedItem);
        //console.log($scope.questionBanks[selectedItem]._source.questionSetNum);
        //console.log($scope.questionBanks[selectedItem]._source.questionName);
        var title = $scope.questionBanks[selectedItem]._source.questionName;
        //console.log(title);
        title = title.replace(/ /g, "+");
        //console.log(title);
        $location.path( "/memorizeIt/" + $scope.questionBanks[selectedItem]._source.questionSetNum + "/" + title);

    };

    // ----------------------  Quiz Question

  $scope.quizMeClicked = function(selectedItem) {

    //console.log(selectedItem);
    //console.log($scope.questionBanks[selectedItem]._source.questionSetNum);
    //console.log($scope.questionBanks[selectedItem]._source.questionName);

    var title = $scope.questionBanks[selectedItem]._source.questionName;
    //console.log(title);
    title = title.replace(/ /g, "+");
    //console.log(title);

    $location.path( "/quizMe/" + $scope.questionBanks[selectedItem]._source.questionSetNum + "/" + title);

  };    


});


