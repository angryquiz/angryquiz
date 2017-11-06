
var staticEvent = null;

function memorizeCheckAnswerBtnSelectOneClick() {

  if(staticEvent != null ) {
    memorizeSubmitAnswerClickStatic(staticEvent, true);
  }
  
}


function memorizeSubmitAnswerClickStatic(event, fromButtonClick) {
  console.log(event);

  staticEvent = event;

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
      if(finalAns != '' && fromButtonClick == true ) {

      var url = url+"/rest/questions/checkAnswer/"+finalAns+"/"+nickname+"/"+sessionId +"/"+ selNumberSplit[0];    
      $.ajax({ // ajax call starts
            url: url, // JQuery loads serverside.php
            dataType: 'json', // Choosing a JSON datatype
            headers: {'Content-Type': undefined, 'Authorization' : token},
            success: function(data) // Variable data contains the data we get from serverside
            {
              console.log(data);
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

var myApp = angular.module('myApp');

myApp.controller('MemorizeCtrl', function ($filter, auth, $scope, memorizeService, store) {

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
  	$scope.answerMessage = '';

	$scope.memorizeCheckAnswerBtn = false;
	$scope.memorizeNextQuetionBtn = false;
	$scope.memorizeShowWrongAnswerBtn = false;
	$scope.memorizeShowCorrectAnswerBtn = false;

  $("#memorizeCheckAnswerBtnSelectOne").addClass('ng-hide');

  //$scope.apiUrl = 'http://localhost:8080/question-rest';
  $scope.apiUrl = __env.questionCoreApiUrl;  

  //$scope.apiUrl = 'http://api.angryquiz.com/question-rest-auth';
  //$scope.apiUrl = 'https://www.mindelements.net/question-rest-auth';
  localStorage.setItem('native_url', $scope.apiUrl);

  $scope.$watch('auth.profile.name', function(name) {
    if (!name) {
      return;
    }
    
    $scope.message.text = 'Hi ' + auth.profile.nickname + '. Ready to memorize!';
    localStorage.setItem("native_nickname", auth.profile.nickname);

  });

$scope.uploadFile = function() {

	$scope.answerMessage = '';

    var file = $scope.myFile;
    //alert(file);
    var url = "/rest/questions/getFirstQuestion/" + auth.profile.nickname + "/inputFile";
    memorizeService.getFirstQuestionUsingFile(file, url, store, $scope, auth);

  };

$scope.memorizeShowCorrectAnswerBtnClick = function() {

    var questionNumber = $scope.showCorrectLogicQuestionNumber;
    var answer = $scope.showCorrectLogicAnswer;
    $scope.memorizeShowCorrectAnswerBtn = false;
    $scope.memorizeShowWrongAnswerBtn = true;

    //start of showing answer


            console.log('process not correct');

            var parentPanelEl = angular.element('#' + questionNumber +'_parent_panel');            
            parentPanelEl[0].className = 'panel panel-info';
            console.log(parentPanelEl);

            var parentHeadingEl = angular.element('#' + questionNumber +'_parent_heading');
            console.log(parentHeadingEl);
            parentHeadingEl[0].innerText  = parentHeadingEl[0].innerText + '. ';


            //check for radio btn scenario
            var selElem = angular.element('#' + questionNumber);
            console.log(selElem);
            console.log(typeof(selElem));

            if(typeof(selElem) != undefined && selElem[0] != undefined && selElem[0].type != undefined && selElem[0].type == 'radio') {
              console.log('radio detected');  
              /*
              var selElemVal = selElem[0].value;
              var selElemLabel = angular.element('#' + questionNumber + '_' + selElemVal + '_radio_label');
              console.log(selElemLabel);
              selElemLabel[0].style.color = 'red';
              */
              var radios = document.getElementsByName( questionNumber );
              for( m = 0; m < radios.length; m++ ) {
                  console.log(radios[m]);
                  if(radios[m].value == answer) {
                      console.log(radios[m]);
                      var selElemLabelMatch = angular.element('#' + questionNumber + '_' + radios[m].value + '_radio_label');
                      selElemLabelMatch[0].style.fontWeight = 'bold';
                      selElemLabelMatch[0].style.color = 'blue';
                  }
              }

            }

            
            var selectionArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
            var arrayLength = selectionArray.length;

            for (var x = 0; x < arrayLength; x++) {
                var idToCheck = '#' + questionNumber + '_' + selectionArray[x];
                var idToCheckEl = angular.element(idToCheck);
                console.log(idToCheckEl);
                if (typeof(idToCheckEl[0]) == 'undefined') {
                  break;
                }
                
                

                if(typeof(idToCheckEl) != undefined && idToCheckEl[0] != undefined && idToCheckEl[0].type != undefined && idToCheckEl[0].type == 'checkbox') {
                  console.log('checkbox detected');
                  var  idToCheckElVal = idToCheckEl[0].value;
                  if(answer.indexOf(idToCheckElVal) !== -1) {
                    //matches the answer
                    var selElemLabelMatch = angular.element('#' + questionNumber + '_' + selectionArray[x] + '_checkbox_label');
                      selElemLabelMatch[0].style.fontWeight = 'bold';
                      selElemLabelMatch[0].style.color = 'blue';
                  } 



                } 

                if(typeof(idToCheckEl) != undefined && idToCheckEl[0] != undefined && idToCheckEl[0].type != undefined && idToCheckEl[0].type == 'select-one') {
                  console.log('select-one detected');
                  var idToCheckElVal = idToCheckEl[0].value;
                  var selectOneAnswer = answer;
                  var selectOneAnswerLength = idToCheckEl[0].length;                 
                  console.log(selectOneAnswer);
                  console.log(selectOneAnswerLength);

                  //update labels with answered text
                  var selectOptionsLength = idToCheckEl[0].length;
                  var answerLabelMap = [];
                  for(var a=0;a<selectOptionsLength;a++) {
                    if(idToCheckEl[0][a].value == '') {
                      continue;
                    }
                    answerLabelMap[idToCheckEl[0][a].value] = idToCheckEl[0][a].label;
                  }
                  var answerLabel = answerLabelMap[selectionArray[x]];
                  console.log(answerLabel);

                  //put correct value to dropdown box
                  var actualAnswerMap = convertAnswersToMap(answer); 
                  var answerFromMap = actualAnswerMap[selectionArray[x]];
                  console.log(answerFromMap);
                  
                  var selectOptionsLength = idToCheckEl[0].length;
                  for(var a=0;a<selectOptionsLength;a++) {
                    if(idToCheckEl[0][a].value == '') {
                      continue;
                    }
                    if( answerFromMap == idToCheckEl[0][a].value ) {
                      idToCheckEl[0][a].selected = true;
                    }               
                    console.log(idToCheckEl[0][a].value);
                  }     

                  
                }                 
                

            }              

    //end of showing answer


};

$scope.memorizeShowWrongAnswerBtnClick = function() {

	$scope.answerMessage = '';
	var url = "/rest/questions/getWrongAnswer/" + auth.profile.nickname + "/" + store.get('sessionId');
	memorizeService.getWrongAnswer(url, store, $scope, auth);
	$scope.memorizeShowCorrectAnswerBtn = true;
	$scope.memorizeShowWrongAnswerBtn = false;

};


$scope.memorizeNextQuetionBtnClick = function() {

  $("#memorizeNextQuetionBtn").addClass('ng-hide');
	$scope.answerMessage = '';
	var url = "/rest/questions/getNextQuestion/" + auth.profile.nickname + "/" + store.get('sessionId');
	memorizeService.getNextQuestion(url, store, $scope, auth);
};


  $scope.memorizeCheckAnswerBtnClick = function() {
	
    $scope.memorizeCheckAnswerBtn = false;
    $scope.memorizeNextQuetionBtn = true;


	var event = $scope.memorizeEvent;

    var selType = event.target.type;
    var selNumber = event.target.id;
    var selValue = event.target.value;
    console.log(event.target.id);
    console.log(event.target.value);
    console.log(event.target.type);
    console.log('elvalue='+angular.element('#'+event.target.id).val());

    var selectionArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var arrayLength = selectionArray.length;
    var selectedAnswers = [];

    if(selType == 'radio') {

      if(selValue == '') {
    	$scope.answerMessage = 'Select an answer!';
    	$scope.memorizeNextQuetionBtn = false;
      }

      var url = "/rest/questions/checkAnswer/" + selValue + "/" + auth.profile.nickname + "/" + store.get('sessionId') + "/" + selNumber;
      memorizeService.checkAnswer(url, store, $scope);
      
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
          var url = "/rest/questions/checkAnswer/" + finalAns + "/" + auth.profile.nickname + "/" + store.get('sessionId') + "/" + selNumberSplit[0];
          memorizeService.checkAnswer(url, store, $scope);
        } else {
        	$scope.answerMessage = 'Select an answer!';
        	$scope.memorizeNextQuetionBtn = false;
        }
    } // end checkbox

    /*
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
          var url = "/rest/questions/checkAnswer/" + finalAns + "/" + auth.profile.nickname + "/" + store.get('sessionId') + "/" + selNumberSplit[0];
          memorizeService.checkAnswer(url, store, $scope);
        }  else {
        	$scope.answerMessage = 'Select an answer!';
        	$scope.memorizeNextQuetionBtn = false;
        }       
    }
    */

  };

  $scope.memorizeSubmitAnswerClick = function(event) {
  		$scope.memorizeEvent = event;

        $scope.memorizeCheckAnswerBtn = true;
        $scope.memorizeNextQuetionBtn = false;
  };




});