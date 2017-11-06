//https://scotch.io/tutorials/angularjs-best-practices-directory-structure
var myApp = angular.module('myApp');

myApp.controller('QuestionBankCreateCtrl', function ($filter, auth, $scope, store, AQService, ngDialog, $http) {



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

        $scope.message.text = 'Hi ' + auth.profile.nickname + '. Create and upload new question set!';
        $scope.quizSubmitBtn = false;

        localStorage.setItem("native_nickname", auth.profile.nickname);

    });

    //var data = [{"question":"Select the fruits?","selection":{"a":"apple","b":"banana","c":"milk","d":"soda"},"questionNumber":1,"answer":"","explanation":"","questionType":"multi","memberAnswer":"","memberNumber":"anonymous","sessionId":"577d5095-ee1e-4b94-8ec1-0474b4fd1cfc","status":"QUIZ_QUESTION_INITIALIZED"},{"question":"Monkey eats?","selection":{"a":"apple","b":"banana","c":"milk","d":"soda"},"questionNumber":2,"answer":"","explanation":"","questionType":"single","memberAnswer":"","memberNumber":"anonymous","sessionId":"577d5095-ee1e-4b94-8ec1-0474b4fd1cfc","status":"QUIZ_QUESTION_INITIALIZED"},{"question":"Match the terms below.","selection":{"a":"Known as H2O","b":"Free liquid","c":"Non-free liquid","d":"Banana","e":"Toy","f":"|","g":"water","h":"soda","i":"bread","j":"monkey","k":"human"},"questionNumber":3,"answer":"","explanation":"","questionType":"match-term","memberAnswer":"","memberNumber":"anonymous","sessionId":"577d5095-ee1e-4b94-8ec1-0474b4fd1cfc","status":"QUIZ_QUESTION_INITIALIZED","questionsMap":{"b":"Free liquid","a":"Known as H2O","e":"Toy","d":"Banana","c":"Non-free liquid"},"answersMap":{"b":"soda","a":"water","e":"human","d":"monkey","c":"bread"}}];
    //var data = [{"question":"Select the fruits?","selection":{"a":"apple","b":"banana","c":"milk","d":"soda"},"questionNumber":1,"answer":"","explanation":"","questionType":"multi","memberAnswer":"","memberNumber":"anonymous","sessionId":"577d5095-ee1e-4b94-8ec1-0474b4fd1cfc","status":"QUIZ_QUESTION_INITIALIZED"},{"question":"Monkey eats?","selection":{"a":"apple","b":"banana","c":"milk","d":"soda"},"questionNumber":2,"answer":"","explanation":"","questionType":"single","memberAnswer":"","memberNumber":"anonymous","sessionId":"577d5095-ee1e-4b94-8ec1-0474b4fd1cfc","status":"QUIZ_QUESTION_INITIALIZED"},{"question":"Match the terms below.","selection":{"a":"Known as H2O","b":"Free liquid","c":"Non-free liquid","d":"Banana","e":"Toy","f":"|","g":"water","h":"soda","i":"bread","j":"monkey","k":"human"},"questionNumber":3,"answer":"","explanation":"","questionType":"match-term","memberAnswer":"","memberNumber":"anonymous","sessionId":"577d5095-ee1e-4b94-8ec1-0474b4fd1cfc","status":"QUIZ_QUESTION_INITIALIZED","questionsMap":{"b":"Free liquid","a":"Known as H2O","e":"Toy","d":"Banana","c":"Non-free liquid"},"answersMap":{"b":"soda","a":"water","e":"human","d":"monkey","c":"bread"}}];
    //data = [];
    //var data = [{"questionNumber":1,"question":"Select the fruits?","answer":"a,b","correctAnswerCount":0,"explanation":"Explanation 1","illustration":null,"selections":{"a":"apple","b":"banana","c":"milk","d":"soda"},"testerAnswer":null,"testerCorrect":false,"questionType":"multi","memberAnswer":null,"correct":false},{"questionNumber":2,"question":"Monkey eats?","answer":"b","correctAnswerCount":0,"explanation":"Explanation 2","illustration":null,"selections":{"a":"apple","b":"banana","c":"milk","d":"soda"},"testerAnswer":null,"testerCorrect":false,"questionType":"single","memberAnswer":null,"correct":false},{"questionNumber":3,"question":"Match the terms below.","answer":"a=a,b=a,c=b,d=d,e=e","correctAnswerCount":0,"explanation":"Explanation 3","illustration":null,"selections":{"a":"Known as H2O","b":"Free liquid","c":"Non-free liquid","d":"Banana","e":"Toy","f":"|","g":"water","h":"soda","i":"bread","j":"monkey","k":"human"},"testerAnswer":null,"testerCorrect":false,"questionType":"match-term","memberAnswer":null,"correct":false}];

    var mapping = {
        "1": "a",
        "2": "b",
        "3": "c",
        "4": "d",
        "5": "e",
        "6": "f",
        "7": "g",
        "8": "h",
        "9": "i",
        "10": "j",
        "11": "k",
        "12": "l"
    }

    var pingma = {
        "a": "1",
        "b": "2",
        "c": "3",
        "d": "4",
        "e": "5",
        "f": "6",
        "g": "7",
        "h": "8",
        "i": "9",
        "j": "10",
        "k": "11",
        "l": "12"
    }

    var selectionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];


    $scope.bankUrl = __env.questionBankApiUrl;


    $scope.questionSetList = [];

    $scope.userselected = {};

    //sample data
    var data = [{
        "question": "Select the fruits?",
        "selection": {"a": "apple", "b": "banana", "c": "milk", "d": "soda"},
        "questionNumber": 1,
        "answer": "",
        "explanation": "",
        "questionType": "multi",
        "memberAnswer": "",
        "memberNumber": "anonymous",
        "sessionId": "577d5095-ee1e-4b94-8ec1-0474b4fd1cfc",
        "status": "QUIZ_QUESTION_INITIALIZED"
    }, {
        "question": "Monkey eats?",
        "selection": {"a": "apple", "b": "banana", "c": "milk", "d": "soda"},
        "questionNumber": 2,
        "answer": "",
        "explanation": "",
        "questionType": "single",
        "memberAnswer": "",
        "memberNumber": "anonymous",
        "sessionId": "577d5095-ee1e-4b94-8ec1-0474b4fd1cfc",
        "status": "QUIZ_QUESTION_INITIALIZED"
    }, {
        "question": "Match the terms below.",
        "selection": {
            "a": "Known as H2O",
            "b": "Free liquid",
            "c": "Non-free liquid",
            "d": "Banana",
            "e": "Toy",
            "f": "|",
            "g": "water",
            "h": "soda",
            "i": "bread",
            "j": "monkey",
            "k": "human"
        },
        "questionNumber": 3,
        "answer": "",
        "explanation": "",
        "questionType": "match-term",
        "memberAnswer": "",
        "memberNumber": "anonymous",
        "sessionId": "577d5095-ee1e-4b94-8ec1-0474b4fd1cfc",
        "status": "QUIZ_QUESTION_INITIALIZED",
        "questionsMap": {"b": "Free liquid", "a": "Known as H2O", "e": "Toy", "d": "Banana", "c": "Non-free liquid"},
        "answersMap": {"b": "soda", "a": "water", "e": "human", "d": "monkey", "c": "bread"}
    }];

    //var data = [];

    // for (var i = 0, len = data.length; i < len; i++) {
    //     if (data[i].answersMap != undefined) {
    //         data[i].arrayOfAnswerMap = AQService.unShuffleMap(data[i].answersMap);
    //     }
    //     if (data[i].questionsMap != undefined) {
    //         data[i].arrayOfQuestionsMap = AQService.unShuffleMap(data[i].questionsMap);
    //     }
    //     if (data[i].selection != undefined) {
    //         data[i].arrayOfSelection = AQService.unShuffleMap(data[i].selection);
    //     }
    //     console.log(data);
    // }

    //sample data
    //$scope.questionSetList = data;


    //text field manipulation/validation

    $scope.onSingleQuestionTextFieldChange = function (questionNum) {
        //console.log(questionNum);
        var idToCheck = '#' + questionNum + '_question_single_text_input';
        var idToCheckEl = angular.element(idToCheck);
        //console.log(idToCheckEl[0].value);
        $scope.questionSetList[questionNum - 1].question = idToCheckEl[0].value
    };

    $scope.onMultiQuestionTextFieldChange = function (questionNum) {
        //console.log(questionNum);
        var idToCheck = '#' + questionNum + '_question_multi_text_input';
        var idToCheckEl = angular.element(idToCheck);
        //console.log(idToCheckEl[0].value);
        $scope.questionSetList[questionNum - 1].question = idToCheckEl[0].value
    };

    $scope.onMatchTermQuestionTextFieldChange = function (questionNum) {
        //console.log(questionNum);
        var idToCheck = '#' + questionNum + '_question_match_term_text_input';
        var idToCheckEl = angular.element(idToCheck);
        //console.log(idToCheckEl[0].value);
        $scope.questionSetList[questionNum - 1].question = idToCheckEl[0].value
    };

    //explanation - update values

    $scope.onSingleExplanationTextFieldChange = function (questionNum) {
        //console.log(questionNum);
        var idToCheck = '#' + questionNum + '_explanation_single_text_input';
        var idToCheckEl = angular.element(idToCheck);
        //console.log(idToCheckEl[0].value);
        $scope.questionSetList[questionNum - 1].explanation = idToCheckEl[0].value
    };

    $scope.onMultiExplanationTextFieldChange = function (questionNum) {
        //console.log(questionNum);
        var idToCheck = '#' + questionNum + '_explanation_multi_text_input';
        var idToCheckEl = angular.element(idToCheck);
        //console.log(idToCheckEl[0].value);
        $scope.questionSetList[questionNum - 1].explanation = idToCheckEl[0].value
    };


    $scope.onMatchTermExplanationTextFieldChange = function (questionNum) {
        //console.log(questionNum);
        var idToCheck = '#' + questionNum + '_explanation_match_term_text_input';
        var idToCheckEl = angular.element(idToCheck);
        //console.log(idToCheckEl[0].value);
        $scope.questionSetList[questionNum - 1].explanation = idToCheckEl[0].value
    };


    //upload logic


    $scope.upload = function (event) {
        alert(1);
    };


    //validate logic

    $scope.validate = function (event) {


        // {
        //     "questionName": "",
        //     "questionTag": [
        //     ""
        // ],
        //     "questions": [
        //     {
        //         "questionNumber": 0,
        //         "question": "",
        //         "answer": "",
        //         "correctAnswerCount": 0,
        //         "explanation": "",
        //         "illustration": "",
        //         "selections": "Map[string,string]",
        //         "testerAnswer": "",
        //         "testerCorrect": false,
        //         "questionType": "",
        //         "memberAnswer": "",
        //         "correct": false
        //     }
        // ],
        //     "owner": "",
        //     "date": ""
        // }

        if ($scope.questionSetName == undefined || $scope.questionSetName == '') {
            showDialog('Question Set Name is required.');
            return;
        }

        if ($scope.questionSetTags == undefined || $scope.questionSetTags == '') {
            showDialog('Question Set Tags are required. Separate multiple tags with comma.');
            return;
        }

        var q = {};

        q.questionName = $scope.questionSetName;
        q.owner = 'anonymous'
        q.date = new Date().toISOString();

        if ($scope.questionSetTags.includes(',') && $scope.questionSetTags.split(',').length > 0) {
            q.questionTag = $scope.questionSetTags.split(',');
        } else {
            q.questionTag = [];
            q.questionTag.push($scope.questionSetTags);
        }

        var questionSetItems = $scope.questionSetList;

        if (questionSetItems.length == 0) {
            showDialog('Please add questions. Add single answer, multiple answer or match-term question.');
            return;
        }

        q.questions = [];

        var qs = {};
        for (var needle = 0; needle < questionSetItems.length; needle++) {
            var qItem = questionSetItems[needle];
            console.log(qItem);
            qs = {};
            qs.questionNumber = qItem.questionNumber;

            if (qItem.question == undefined || qItem.question.length == 0) {
                showDialog('Please enter your question in #' + qItem.questionNumber);
                return;
            }

            qs.question = qItem.question;


            //validate answer emptiness
            if (qItem.answer == undefined || qItem.answer == '') {
                showDialog('Please (re)select/review answer(s) for question #' + qItem.questionNumber);
                return;
            }

            //validate multi answer
            if (qItem.questionType == 'multi' && qItem.answer.includes(',') == false) {
                showDialog('Please select two or more answers for question #' + qItem.questionNumber);
                return;
            }

            //validata match-term. ensure all items are matched.
            if (qItem.questionType == 'match-term' && qItem.arrayOfQuestionsMap.length != qItem.answer.split(',').length) {
                showDialog('Please answer all items to be matched in #' + qItem.questionNumber);
                return;
            }
            qs.answer = qItem.answer;

            qs.selections = {};

            //for single and multi

            var singleMultiSelections = [];
            for (var lm = 0; lm < qItem.arrayOfSelection.length; lm++) {
                singleMultiSelections.push(qItem.arrayOfSelection[lm].value);
            }
            var singleMultiSelectionsObj = {};
            for (var i = 0; i < singleMultiSelections.length; i++) {
                singleMultiSelectionsObj[selectionArray[i]] = singleMultiSelections[i];
            }
            qs.selections = singleMultiSelectionsObj;

            // for match-term

            if (qItem.questionType == 'match-term') {

                console.log(qItem.arrayOfQuestionsMap);
                console.log(qItem.arrayOfAnswerMap);
                var allSelections = [];
                for (var lm = 0; lm < qItem.arrayOfQuestionsMap.length; lm++) {
                    allSelections.push(qItem.arrayOfQuestionsMap[lm].value);
                }
                allSelections.push("|");
                for (var lm = 0; lm < qItem.arrayOfAnswerMap.length; lm++) {
                    allSelections.push(qItem.arrayOfAnswerMap[lm].value);
                }
                console.log(allSelections);

                var allSelectionsObj = {};

                for (var i = 0; i < allSelections.length; i++) {
                    allSelectionsObj[selectionArray[i]] = allSelections[i];
                }
                qs.selections = allSelectionsObj;

            }
            qs.correctAnswerCount = 0;
            qs.explanation = qItem.explanation;
            qs.illustration = '';
            qs.testerAnswer = '';
            qs.testerCorrect = false;
            qs.questionType = qItem.questionType; //single, multi, match-term
            qs.memberAnswer = '';
            qs.correct = false;
            q.questions.push(qs)
        }

        console.log(q);

        //upload
        $http.get($scope.bankUrl + '/rest/question-bank/getQuestionSetNum', {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'Authorization': store.get('token')}
        })
            .success(function (data, status, headers, config) {
                var questionSetNum = data.get._source.questionSetNum;
                console.log(q);
                q.questionSetNum = questionSetNum;
                console.log(q);
                upload(q);
            })
            .error(function (data, status, headers, config) {
                alert('Unexpected error occurred.' + status);
            });

    };


    function upload(q) {


        $http.put($scope.bankUrl + '/rest/question-bank/questionbank/questions', JSON.stringify(q), {
            transformRequest: angular.identity,
            headers: {'Content-Type': 'application/json'}
        })
            .success(function (data, status, headers, config) {
                console.log(data);
                console.log(status);

                if(status == '200') {
                    showDialog('Question uploaded successfully. Create another question or search existing ones.');
                    $scope.questionSetList = [];
                    $scope.questionSetName = '';
                    $scope.questionSetTags = '';
                }

            })
            .error(function (data, status, headers, config) {
                console.log(data);
                console.log(status);
                showDialog('Unknown error occurred.');
            });


    }
    //on select answers

    $scope.quizSubmitAnswerMatchTermClick = function (input) {

        console.log(input);

        var selectedAnswers = [];
        var selectionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var arrayLength = selectionArray.length;


        var selNumberSplit = input.split("_");
        var num = selNumberSplit[0];
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
                if (idToCheckValue != '') {
                    selectedAnswers.push(selectionArray[i] + "=" + idToCheckValue);
                }
            }
        }
        console.log(selectedAnswers);
        var finalAns = selectedAnswers.join(",");
        console.log(finalAns);

        $scope.questionSetList[num - 1].answer = finalAns;

    }

    $scope.quizSubmitAnswerClick = function (event) {
        console.log(event);
        var selType = event.target.type;
        var selNumber = event.target.id;
        var selValue = event.target.value;
        //console.log('selNumber=' + selNumber);
        //console.log('selValue=' + selValue);
        //console.log('selType=' + selType);
        //console.log('elvalue=' + angular.element('#' + event.target.id).val());

        var selectionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var arrayLength = selectionArray.length;
        var selectedAnswers = [];

        if (selType == 'radio') {
            console.log(selectedAnswers);
            $scope.questionSetList[selNumber - 1].answer = selValue;
        }

        if (selType == 'checkbox') {
            console.log(event.target.checked);
            var selNumberSplit = selNumber.split("_");
            var num = selNumberSplit[0];
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
                    if (idToCheckValue != '' && idToCheckValue == true) {
                        selectedAnswers.push(selectionArray[i]);
                    }
                }
            }
            console.log(selectedAnswers);
            $scope.questionSetList[num - 1].answer = selectedAnswers.join(",");

        } // end checkbox

    };

    function showDialog(field) {
        ngDialog.open({
            template: '<p>' + field + '</p>',
            plain: true
        });
    }

    // Match term methods
    $scope.deleteMatchTermAnswerItemSelection = function (event) {
        var targetId = event.target.id;
        var targetIdSpl = targetId.split('_');
        var itemNum = targetIdSpl[0];

        //delete answer when question or answer is re-organized. re-select again
        $scope.questionSetList[itemNum - 1].answer = "";

        var answerItemNum = pingma[targetIdSpl[1]];
        var data = $scope.questionSetList[itemNum - 1];
        var newData = [];
        for (var a = 0; a < data.arrayOfAnswerMap.length; a++) {
            if ((answerItemNum - 1) == a) {
                continue;
            }
            newData.push(data.arrayOfAnswerMap[a])
        }
        //re-number data
        var replaceData = [];
        for (var b = 0; b < newData.length; b++) {
            var newAnswer = new Object();
            newAnswer['key'] = mapping[b + 1];
            newAnswer['value'] = newData[b]['value'];
            replaceData.push(newAnswer);
        }
        data.arrayOfAnswerMap = replaceData;
    };

    $scope.addMatchTermItemSelection = function (event) {
        var targetId = event.target.id;
        var targetIdSpl = targetId.split('_');
        var itemNum = targetIdSpl[0];

        //delete answer when question or answer is re-organized. re-select again
        $scope.questionSetList[itemNum - 1].answer = "";

        var fld = itemNum + '_item_selection_input_text';
        var value = angular.element('#' + fld).val();
        var data = $scope.questionSetList[itemNum - 1];
        var newAnswer = new Object();
        if (data.arrayOfAnswerMap.length > 0) {
            newAnswer['key'] = mapping[data.arrayOfAnswerMap.length + 1];
            newAnswer['value'] = value;
            data.arrayOfAnswerMap.push(newAnswer);
        } else {
            data.arrayOfSelection = [];
            var newAnswer = new Object();
            newAnswer['key'] = "a";
            newAnswer['value'] = value;
            data.arrayOfAnswerMap.push(newAnswer);
        }
    };

    $scope.deleteMatchTermItemToMatchSelection = function (event) {
        var targetId = event.target.id;
        var targetIdSpl = targetId.split('_');
        var itemNum = targetIdSpl[0];

        //delete answer when question or answer is re-organized. re-select again
        $scope.questionSetList[itemNum - 1].answer = "";

        var answerItemNum = pingma[targetIdSpl[1]];
        var data = $scope.questionSetList[itemNum - 1];
        var newData = [];
        for (var a = 0; a < data.arrayOfQuestionsMap.length; a++) {
            if ((answerItemNum - 1) == a) {
                continue;
            }
            newData.push(data.arrayOfQuestionsMap[a])
        }
        //re-number data
        var replaceData = [];
        for (var b = 0; b < newData.length; b++) {
            var newAnswer = new Object();
            newAnswer['key'] = mapping [b + 1];
            newAnswer['value'] = newData[b]['value'];
            replaceData.push(newAnswer);
        }
        data.arrayOfQuestionsMap = replaceData;
    };

    $scope.addMatchTermItemToMatchSelection = function (event) {
        var targetId = event.target.id;
        var targetIdSpl = targetId.split('_');
        var itemNum = targetIdSpl[0];

        //delete answer when question or answer is re-organized. re-select again
        $scope.questionSetList[itemNum - 1].answer = "";

        var fld = itemNum + '_item_to_match_input_text';
        var value = angular.element('#' + fld).val();
        var data = $scope.questionSetList[itemNum - 1];
        var newAnswer = new Object();
        if (data.arrayOfQuestionsMap.length > 0) {
            newAnswer['key'] = mapping[data.arrayOfQuestionsMap.length + 1];
            newAnswer['value'] = value;
            data.arrayOfQuestionsMap.push(newAnswer);
        } else {
            data.arrayOfSelection = [];
            var newAnswer = new Object();
            newAnswer['key'] = "a";
            newAnswer['value'] = value;
            data.arrayOfQuestionsMap.push(newAnswer);
        }
    };


    $scope.addMatchTermQuestion = function () {
        var item = {};
        item.questionNumber = $scope.questionSetList.length + 1;
        item.question = "";
        item.explanation = "";
        item.answer = "";
        item.questionType = "match-term";
        item.arrayOfQuestionsMap = [];
        item.arrayOfAnswerMap = [];
        $scope.questionSetList.push(item);
    };

    // Multi answer methods

    $scope.deleteMultiAnswerSelection = function (event) {
        var targetId = event.target.id;
        var targetIdSpl = targetId.split('_');
        var itemNum = targetIdSpl[0];

        //delete answer when question or answer is re-organized. re-select again
        $scope.questionSetList[itemNum - 1].answer = "";

        var answerItemNum = pingma[targetIdSpl[1]];
        var data = $scope.questionSetList[itemNum - 1];
        var newData = [];
        for (var a = 0; a < data.arrayOfSelection.length; a++) {
            if ((answerItemNum - 1) == a) {
                continue;
            }
            newData.push(data.arrayOfSelection[a])
        }
        //re-number data
        var replaceData = [];
        for (var b = 0; b < newData.length; b++) {
            var newAnswer = new Object();
            newAnswer['key'] = mapping [b + 1];
            newAnswer['value'] = newData[b]['value'];
            replaceData.push(newAnswer);
        }
        data.arrayOfSelection = replaceData;
    };

    $scope.addMultiAnswerSelection = function (event) {
        var targetId = event.target.id;
        var targetIdSpl = targetId.split('_');
        var itemNum = targetIdSpl[0];

        var fld = itemNum + '_addnewselection_multi_text_input';
        var value = angular.element('#' + fld).val();
        var data = $scope.questionSetList[itemNum - 1];
        var newAnswer = new Object();
        if (data.arrayOfSelection.length > 0) {
            newAnswer['key'] = mapping [data.arrayOfSelection.length + 1];
            newAnswer['value'] = value;
            data.arrayOfSelection.push(newAnswer);
        } else {
            data.arrayOfSelection = [];
            var newAnswer = new Object();
            newAnswer['key'] = "a";
            newAnswer['value'] = value;
            data.arrayOfSelection.push(newAnswer);
        }
    };

    $scope.addMultiAnswerQuestion = function () {
        var item = {};
        item.questionNumber = $scope.questionSetList.length + 1;
        item.question = "";
        item.explanation = "";
        item.answer = "";
        item.questionType = "multi";
        item.arrayOfSelection = [];
        $scope.questionSetList.push(item);
    };


    // Single Answer Methods
    $scope.deleteOneQuestion = function (event) {
        var targetId = event.target.id;
        var targetIdSpl = targetId.split('_');
        var itemNum = targetIdSpl[0];
        if ($scope.questionSetList.length == 1) {
            $scope.questionSetList = [];
        } else {
            $scope.questionSetList.splice(itemNum - 1, 1);
            //re-number data
            for (var b = 0; b < $scope.questionSetList.length; b++) {
                $scope.questionSetList[b].questionNumber = b + 1;
            }
        }

    }

    $scope.deleteSingleAnswerSelection = function (event) {
        var targetId = event.target.id;
        var targetIdSpl = targetId.split('_');
        var itemNum = targetIdSpl[0];

        //delete answer when question or answer is re-organized. re-select again
        $scope.questionSetList[itemNum - 1].answer = "";

        var answerItemNum = pingma[targetIdSpl[1]];
        var data = $scope.questionSetList[itemNum - 1];
        var newData = [];
        for (var a = 0; a < data.arrayOfSelection.length; a++) {
            if ((answerItemNum - 1) == a) {
                continue;
            }
            newData.push(data.arrayOfSelection[a])
        }
        //re-number data
        var replaceData = [];
        for (var b = 0; b < newData.length; b++) {
            var newAnswer = new Object();
            newAnswer['key'] = mapping [b + 1];
            newAnswer['value'] = newData[b]['value'];
            replaceData.push(newAnswer);
        }
        data.arrayOfSelection = replaceData;
    };

    $scope.addSingleAnswerSelection = function (event) {
        var targetId = event.target.id;
        var targetIdSpl = targetId.split('_');
        var itemNum = targetIdSpl[0];
        var fld = itemNum + '_addnewselection_single_text_input';
        var value = angular.element('#' + fld).val();
        var data = $scope.questionSetList[itemNum - 1];
        var newAnswer = new Object();
        if (data.arrayOfSelection.length > 0) {
            newAnswer['key'] = mapping [data.arrayOfSelection.length + 1];
            newAnswer['value'] = value;
            data.arrayOfSelection.push(newAnswer);
        } else {
            data.arrayOfSelection = [];
            var newAnswer = new Object();
            newAnswer['key'] = "a";
            newAnswer['value'] = value;
            data.arrayOfSelection.push(newAnswer);
        }
    };

    $scope.addSingleAnswerQuestion = function () {
        var item = {};
        item.questionNumber = $scope.questionSetList.length + 1;
        item.question = "";
        item.explanation = "";
        item.answer = "";
        item.questionType = "single";
        item.arrayOfSelection = [];
        $scope.questionSetList.push(item);
    };

});




