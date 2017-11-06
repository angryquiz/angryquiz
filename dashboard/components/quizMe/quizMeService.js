var myApp = angular.module('myApp');

myApp.service('quizMeService', ['$http', 'AQService', function ($http, AQService) {

    this.getResultsToUrl = function (toUrl, store, $scope, auth) {

        // returns  Map()
        convertAnswersToMap = function (answersMap) {

            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
            //map is not supported on all browser.
            var map = new Object();
            var answersMapSplit = answersMap.split(',');
            for (var f = 0; f < answersMapSplit.length; f++) {
                var answersMapItem = answersMapSplit[f];
                var answersMapItemSplit = answersMapItem.split("=");
                //console.log(answersMapItem);
                map[answersMapItemSplit[0]] = answersMapItemSplit[1];
            }
            return map;
        }

        $http.get($scope.apiUrl + toUrl, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'Authorization': store.get('token')}
        })
            .success(function (data, status, headers, config) {
                //console.log(data);

                var quizCorrectAnswer = 0;
                for (var i = 0, len = data.length; i < len; i++) {

                    var questionNumber = data[i].questionNumber;
                    var explanation = data[i].explanation;
                    var answer = data[i].answer;
                    var memberAnswer = data[i].memberAnswer;

                    //console.log(data[i].questionNumber);
                    //console.log(data[i].correct);
                    var correct = data[i].correct;
                    if (correct != undefined && correct == true) {
                        //console.log('correct');
                        var parentPanelEl = angular.element('#' + questionNumber + '_parent_panel');
                        parentPanelEl[0].className = 'panel panel-success';
                        //console.log(parentPanelEl);

                        var parentHeadingEl = angular.element('#' + questionNumber + '_parent_heading');
                        //console.log(parentHeadingEl);
                        parentHeadingEl[0].innerText = parentHeadingEl[0].innerText + '. Correct!' + ' Explanation: ' + explanation;

                        quizCorrectAnswer++;
                    } else {
                        //console.log('process not correct');

                        var parentPanelEl = angular.element('#' + questionNumber + '_parent_panel');
                        parentPanelEl[0].className = 'panel panel-info';
                        //console.log(parentPanelEl);

                        var parentHeadingEl = angular.element('#' + questionNumber + '_parent_heading');
                        //console.log(parentHeadingEl);
                        parentHeadingEl[0].innerText = parentHeadingEl[0].innerText + '. Incorrect!' + ' Explanation: ' + explanation;


                        //check for radio btn scenario
                        var selElem = angular.element('#' + questionNumber);
                        //console.log(selElem);
                        //console.log(typeof(selElem));

                        if (typeof(selElem) != undefined && selElem[0] != undefined && selElem[0].type != undefined && selElem[0].type == 'radio') {
                            //console.log('radio detected');
                            var radios = document.getElementsByName(questionNumber);
                            for (m = 0; m < radios.length; m++) {
                                //console.log(radios[m]);
                                if (radios[m].value == answer) {
                                    //console.log(radios[m]);
                                    var selElemLabelMatch = angular.element('#' + questionNumber + '_' + radios[m].value + '_radio_label');
                                    selElemLabelMatch[0].style.fontWeight = 'bold';
                                    selElemLabelMatch[0].style.color = 'blue';
                                }
                                if (radios[m].value == memberAnswer) {
                                    //console.log(radios[m]);
                                    var selElemLabelMatch = angular.element('#' + questionNumber + '_' + radios[m].value + '_radio_label');
                                    selElemLabelMatch[0].style.fontWeight = 'bold';
                                    selElemLabelMatch[0].style.color = 'red';
                                }
                            }

                        }


                        var selectionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
                        var arrayLength = selectionArray.length;

                        for (var x = 0; x < arrayLength; x++) {
                            var idToCheck = '#' + questionNumber + '_' + selectionArray[x];
                            var idToCheckEl = angular.element(idToCheck);
                            //console.log(idToCheckEl);
                            if (typeof(idToCheckEl[0]) == 'undefined') {
                                break;
                            }


                            if (typeof(idToCheckEl) != undefined && idToCheckEl[0] != undefined && idToCheckEl[0].type != undefined && idToCheckEl[0].type == 'checkbox') {
                                //console.log('checkbox detected');
                                var idToCheckElVal = idToCheckEl[0].value;
                                if (answer.indexOf(idToCheckElVal) !== -1) {
                                    //matches the answer
                                    var selElemLabelMatch = angular.element('#' + questionNumber + '_' + selectionArray[x] + '_checkbox_label');
                                    selElemLabelMatch[0].style.fontWeight = 'bold';
                                    selElemLabelMatch[0].style.color = 'blue';
                                }

                                if (memberAnswer.indexOf(idToCheckElVal) !== -1) {
                                    //matches the answer
                                    var selElemLabelMatch = angular.element('#' + questionNumber + '_' + selectionArray[x] + '_checkbox_label');
                                    selElemLabelMatch[0].style.fontWeight = 'bold';
                                    selElemLabelMatch[0].style.color = 'res';
                                }


                            }

                            if (typeof(idToCheckEl) != undefined && idToCheckEl[0] != undefined && idToCheckEl[0].type != undefined && idToCheckEl[0].type == 'select-one') {
                                //console.log('select-one detected');
                                var idToCheckElVal = idToCheckEl[0].value;
                                var selectOneAnswer = answer;
                                var selectMemberAnswer = memberAnswer;
                                var selectOneAnswerLength = idToCheckEl[0].length;
                                //console.log(selectOneAnswer);
                                //console.log(selectMemberAnswer);
                                //console.log(selectOneAnswerLength);

                                //update labels with answered text
                                var selectOptionsLength = idToCheckEl[0].length;
                                var answerLabelMap = [];
                                for (var a = 0; a < selectOptionsLength; a++) {
                                    if (idToCheckEl[0][a].value == '') {
                                        continue;
                                    }
                                    answerLabelMap[idToCheckEl[0][a].value] = idToCheckEl[0][a].label;
                                }
                                var answerLabel = answerLabelMap[selectionArray[x]];
                                //console.log(answerLabel);

                                var memberAnswerMap = convertAnswersToMap(memberAnswer);
                                var selElemLabelMatch = angular.element('#' + questionNumber + '_' + selectionArray[x] + '_select_one_label');
                                if (memberAnswerMap[selectionArray[x]] != undefined) {
                                    selElemLabelMatch[0].innerText = selElemLabelMatch[0].innerText + '. You answered: ' + answerLabelMap[memberAnswerMap[selectionArray[x]]];
                                    selElemLabelMatch[0].style.fontWeight = 'bold';
                                    selElemLabelMatch[0].style.color = 'red';
                                } else {
                                    selElemLabelMatch[0].innerText = selElemLabelMatch[0].innerText + '. You did not answer this.';
                                    selElemLabelMatch[0].style.fontWeight = 'bold';
                                    selElemLabelMatch[0].style.color = 'red';
                                }


                                //put correct value to dropdown box
                                var actualAnswerMap = convertAnswersToMap(answer);
                                var answerFromMap = actualAnswerMap[selectionArray[x]];
                                //console.log(answerFromMap);

                                var selectOptionsLength = idToCheckEl[0].length;
                                for (var a = 0; a < selectOptionsLength; a++) {
                                    if (idToCheckEl[0][a].value == '') {
                                        continue;
                                    }
                                    if (answerFromMap == idToCheckEl[0][a].value) {
                                        idToCheckEl[0][a].selected = true;
                                    }
                                    //console.log(idToCheckEl[0][a].value);
                                }

                                //convert to blue, whichever is the correct answer.

                                if (memberAnswerMap[selectionArray[x]] == idToCheckEl[0].value) {
                                    selElemLabelMatch[0].style.fontWeight = 'bold';
                                    selElemLabelMatch[0].style.color = 'blue';
                                }


                            }


                        }

                    }

                }

                var ave = ( quizCorrectAnswer / data.length ) * 100;
                ave = Math.round(ave);
                $scope.message.text = 'Hi ' + auth.profile.nickname;
                $scope.QuizMeResults = 'Quiz Results -> Total: ' + data.length + ' Correct Answer: ' + quizCorrectAnswer + '  Average: ' + ave + '%';

            })
            .error(function (data, status, headers, config) {
                alert('Unexpected error occurred.' + status);
            });
    }

    this.submitAnswerToUrl = function (toUrl, store, $scope) {

        $http.get($scope.apiUrl + toUrl, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'Authorization': store.get('token')}
        })
            .success(function (data, status, headers, config) {
                //console.log(data);
            })
            .error(function (data, status, headers, config) {
                alert('Unexpected error occurred.' + status);

            });
    };

    this.getQuestionUsingQuetionSetNum = function (url, store, $scope, auth) {

        $http.get($scope.questionBankApiUrl + url, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'Authorization': store.get('token')}
        })
            .success(function (data, status, headers, config) {
                var items = data.hits.hits;

                var json = angular.toJson(items[0]._source.questions, false);

                var payload = "{\"questions\": " + json + "}";

                var uploadUrl = '/rest/quiz/submitQuestionList/' + auth.profile.nickname;

                uploadQuestionSet(uploadUrl, store, $scope, auth, payload, items[0]._source.questionName);

            })
            .error(function (data, status, headers, config) {
                alert('Unexpected error occurred.' + status);
            });

    };

    function uploadQuestionSet(uploadUrl, store, $scope, auth, payload, title) {

        $scope.showSearchAnotherQuiz = true;

        $http.put($scope.apiUrl + uploadUrl, payload, {
            transformRequest: angular.identity,
            headers: {'Content-Type': 'application/json', 'Authorization': store.get('token')}
        })

            .success(function (data, status, headers, config) {

                $scope.questionName = title;

                $scope.showSearchScreen = false;
                $scope.showQuizBankItems = true;
                $scope.message.text = 'Hi' + auth.profile.nickname + ', Good luck.';

                for (var i = 0, len = data.length; i < len; i++) {
                    if (i === 0) {
                        //get session id
                        store.set('sessionId', data[i].sessionId);
                        localStorage.setItem('native_sessionId', data[i].sessionId);
                    }
                    if (data[i].answersMap != undefined) {
                        data[i].arrayOfAnswerMap = AQService.shuffleMap(data[i].answersMap);
                    }

                    if (data[i].questionsMap != undefined) {
                        data[i].arrayOfQuestionsMap = AQService.shuffleMap(data[i].questionsMap);
                    }

                    if (data[i].selection != undefined) {
                        data[i].arrayOfSelection = AQService.shuffleMap(data[i].selection);
                    }

                }
                //http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript

                $scope.quizMeSubmitBtn = true;

                $scope.quizMeItems = data;

            })

            .error(function (data, status, headers, config) {
                alert('Unexpected error occurred.' + status);

            });

    };


}
]);
