var staticEvent = null;

function memorizeItCheckAnswerBtnSelectOneClick() {

    if(staticEvent != null ) {
        memorizeSubmitAnswerClickStatic(staticEvent, true);
    }

}


function memorizeItSubmitAnswerClickStatic(event, fromButtonClick) {
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


var myApp = angular.module('myApp');

myApp.service('memorizeItService', ['$http', 'AQService', function ($http, AQService) {

    this.getWrongAnswer = function(url, store, $scope, auth){

        $scope.message.text = 'Hi ' + auth.profile.nickname + '. Good luck!';

        //console.log(store.get('token'));

        convertAnswersToMap = function(answersMap) {

            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
            //map is not supported on all browser.
            var map = new Object();
            var answersMapSplit = answersMap.split(',');
            for(var f=0;f<answersMapSplit.length;f++) {
                var answersMapItem = answersMapSplit[f];
                var answersMapItemSplit = answersMapItem.split("=");
                //console.log(answersMapItem);
                map[answersMapItemSplit[0]] = answersMapItemSplit[1];
            }
            return map;
        };


        $http.get($scope.apiUrl + url, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'Authorization' : store.get('token')}
        })

            .success(function(data, status, headers, config){

                //console.log(data);



                if(data.status != '' && data.status == 'STATUS_NULL_QUESTIONS_NOT_ANSWERED') {
                    $scope.answerMessage = 'No more or no wrong answer to check!';
                    $scope.memorizeShowCorrectAnswerBtn = false;
                    $scope.memorizeShowWrongAnswerBtn = false;
                    $scope.memorizeCheckAnswerBtn = false;
                    $scope.memorizeNextQuetionBtn = true;
                    return;
                }


                var singleData = [data];

                $scope.showCorrectLogicQuestionNumber = data.questionNumber;
                $scope.showCorrectLogicAnswer = data.answer;

                for (var i = 0, len = singleData.length; i < len; i++) {

                    //get session id
                    //console.log(singleData[i].sessionId);

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

                $scope.memorizeReadOnlyItems = singleData;
                $scope.memorizeItems = [];

                $scope.memorizeCheckAnswerBtn = false;
                $scope.memorizeNextQuetionBtn = false;

            })

            .error(function(data, status, headers, config){

                alert('Unexpected error occurred.' + status);

            });
    };

    this.getNextQuestion = function(url, store, $scope, auth, $route){

        $('#answerSelectOne').text('');

        $scope.message = 'Hi ' + auth.profile.nickname + '. Good luck!';

        //console.log(store.get('token'));


        $http.get($scope.apiUrl + url, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'Authorization' : store.get('token')}
        })

            .success(function(data, status, headers, config){

                //console.log(data);

                if(data.status != '' && data.status == 'QUESTION_SET_TOTAL_REACHED') {
                    $scope.answerMessage = 'Question total reached.';
                    $scope.memorizeShowWrongAnswerBtn = true;
                    $scope.memorizeCheckAnswerBtn = false;
                    $scope.memorizeNextQuetionBtn = false;
                    $scope.memorizeCheckAnswerBtnSelectOne = false;

                    return;
                }

                if(data.status != '' && data.status == 'STATUS_NULL_QUESTIONS_NOT_ANSWERED') {
                    //$scope.answerMessage = 'No more question. Upload another question set!';
                    $scope.answerMessage = 'No more question. Search or create new question set.';
                    $scope.memorizeShowWrongAnswerBtn = false;
                    $scope.memorizeCheckAnswerBtn = false;
                    $scope.memorizeNextQuetionBtn = false;
                    $scope.memorizeItems = [];
                    $scope.showStartOverMemorize = true;
                    $scope.questionName = "";
                    return;
                }



                var singleData = [data];

                for (var i = 0, len = singleData.length; i < len; i++) {

                    //get session id
                    //console.log(singleData[i].sessionId);

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

                alert('Unexpected error occurred.' + status);

            });
    };

    this.checkAnswer = function(toUrl, store, $scope, auth){

        $http.get($scope.apiUrl + toUrl, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'Authorization' : store.get('token')}
        })

            .success(function(data, status, headers, config){

                //console.log(data);
                $scope.answerMessage = data.answer;

            })
            .error(function(data, status, headers, config){
                alert('Unexpected error occurred.' + status);
            });
    };


    this.memorizeQuestionUsingQuetionSetNum = function (url, store, $scope, auth) {

        $http.get($scope.questionBankApiUrl + url, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'Authorization': store.get('token')}
        })
            .success(function (data, status, headers, config) {
                var items = data.hits.hits;

                var json = angular.toJson(items[0]._source.questions, false);

                var payload = "{\"questions\": " + json + "}";

                var uploadUrl = '/rest/questions/submitQuestionList/' + auth.profile.nickname;

                //console.log(payload);

                uploadQuestionSetToMemorize(uploadUrl, store, $scope, auth, payload, items[0]._source.questionName);

            })
            .error(function (data, status, headers, config) {
                alert('Unexpected error occurred.' + status);
            });

    };



    function uploadQuestionSetToMemorize(uploadUrl, store, $scope, auth, payload, title) {

        $http.put($scope.apiUrl  + uploadUrl, payload, {
            transformRequest: angular.identity,
            headers: {'Content-Type': 'application/json', 'Authorization' : store.get('token')}
        })

            .success(function(data, status, headers, config){
                //console.log(data);
                //console.log(status);

                $scope.questionName = title;

                $scope.showMemorizeQuestionItems = true;
                $scope.message.text = 'Hi ' + auth.profile.nickname + ', Good luck.';
                //console.log(data);

                var singleData = [data];

                for (var i = 0, len = singleData.length; i < len; i++) {

                    //get session id
                    //console.log(singleData[i].sessionId);
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
                alert('Unexpected error occurred.' + status);
            });

    };

}]);
