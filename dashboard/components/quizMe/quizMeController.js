//https://scotch.io/tutorials/angularjs-best-practices-directory-structure
var myApp = angular.module('myApp');

myApp.controller('QuizMeCtrl', function ($filter, auth, $scope, quizMeService, store, $routeParams, $location) {


    if (auth.isAuthenticated == false) {
        auth.profile = {};
        var today = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z');
        auth.profile.name = 'anonymous';
        auth.profile.nickname = 'anonymous';
        auth.profile.email = 'email@anonymous.com';
        auth.profile.created_at = today;
        auth.profile.updated_at = today;
    }
    $scope.auth = auth;

    $scope.questionBankApiUrl = __env.questionBankApiUrl;
    $scope.apiUrl = __env.questionCoreApiUrl;

    localStorage.setItem('native_url', $scope.apiUrl);

    $scope.owner = auth.profile.nickname;

    $scope.$watch('auth.profile.name', function (name) {
        if (!name) {
            return;
        }

        $scope.message.text = 'Hi ' + auth.profile.nickname + '. Share your question set by uploading it!';
        $scope.quizMeSubmitBtn = false;

        localStorage.setItem("native_nickname", auth.profile.nickname);

    });

    $scope.questionName = "Loading...";

    $scope.quizMeSearchQuiz = false;

    //get question using quesiontSetNum
    quizMeService.getQuestionUsingQuetionSetNum('/rest/question-bank/search/' + $routeParams.questionSetNum, store, $scope, auth);


    //on select answers - match terms
    $scope.quizMeSubmitAnswerMatchTermClick = function (input) {

        //console.log(input);

        var selectedAnswers = [];
        var selectionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var arrayLength = selectionArray.length;


        var selNumberSplit = input.split("_");
        var num = selNumberSplit[0];
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
                if (idToCheckValue != '') {
                    selectedAnswers.push(selectionArray[i] + "=" + idToCheckValue);
                }
            }
        }
        //console.log(selectedAnswers);
        var finalAns = encodeURIComponent(selectedAnswers.join(","));
        //console.log(finalAns);

        if(finalAns != '') {
            var submitAnswerUrl = "/rest/quiz/saveAnswer/" + finalAns + "/" + auth.profile.nickname + "/" + store.get('sessionId') + "/" + selNumberSplit[0];
            quizMeService.submitAnswerToUrl(submitAnswerUrl, store, $scope);
        }
    };

    $scope.quizMeSearchQuizClicked = function() {
        $scope.quizMeItems = {};
        $location.path( "/questionBankSearch/");
    };


    $scope.quizMeSubmitBtnClick = function() {

        $scope.quizMeSubmitBtn = false;

        var getResultsUrl = "/rest/quiz/getQuizResult/" + auth.profile.nickname + "/" + store.get('sessionId');
        quizMeService.getResultsToUrl(getResultsUrl, store, $scope, auth);

        $scope.quizMeSearchQuiz = true;


    };

    $scope.quizMeSubmitAnswerClick = function(event) {
        var selType = event.target.type;
        var selNumber = event.target.id;
        var selValue = event.target.value;
        //console.log('selNumber='+selNumber);
        //console.log('selValue='+selValue);
        //console.log('selType='+selType);
        //console.log('elvalue='+angular.element('#'+event.target.id).val());

        var selectionArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        var arrayLength = selectionArray.length;
        var selectedAnswers = [];

        if(selType == 'radio') {

            var submitAnswerUrl = "/rest/quiz/saveAnswer/" + selValue + "/" + auth.profile.nickname + "/" + store.get('sessionId') + "/" + selNumber;
            quizMeService.submitAnswerToUrl(submitAnswerUrl, store, $scope);

        }

        if(selType == 'checkbox') {

            //console.log(event.target.checked);
            var selNumberSplit = selNumber.split("_");
            for (var i = 0; i < arrayLength; i++) {
                var idToCheck = '#' + selNumberSplit[0] + '_' + selectionArray[i];
                var idToCheckEl = angular.element(idToCheck);
                //console.log(idToCheckEl);
                if (typeof(idToCheckEl[0]) == 'undefined') {
                    break;
                }
                var idToCheckValue = idToCheckEl[0].checked;
                //console.log(idToCheckValue);

                if (typeof(idToCheckValue) != 'undefined' && idToCheckValue != null) {
                    if(idToCheckValue != '' && idToCheckValue == true) {
                        selectedAnswers.push(selectionArray[i]);
                    }
                }
            }
            //console.log(selectedAnswers);
            var finalAns = encodeURIComponent(selectedAnswers.join(","));
            //console.log(finalAns);

            if(finalAns != '') {
                var submitAnswerUrl = "/rest/quiz/saveAnswer/" + finalAns + "/" + auth.profile.nickname + "/" + store.get('sessionId') + "/" + selNumberSplit[0];
                quizMeService.submitAnswerToUrl(submitAnswerUrl, store, $scope);
            }
        } // end checkbox

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
            if(finalAns != '') {
                var submitAnswerUrl = "/rest/quiz/saveAnswer/" + finalAns + "/" + auth.profile.nickname + "/" + store.get('sessionId') + "/" + selNumberSplit[0];
                quizMeService.submitAnswerToUrl(submitAnswerUrl, store, $scope);
            }
        }
    };



});


