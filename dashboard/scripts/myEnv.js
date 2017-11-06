//http://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/

// prod ME

/*
(function (window) {
  window.__env = window.__env || {};
  window.__env.questionBankApiUrl = '/QuestionBankApp';
  window.__env.questionCoreApiUrl = '/QuestionEngineApp';
  window.__env.baseUrl = '/';
  window.__env.enableDebug = true;
}(this));
*/

//local


(function (window) {
  window.__env = window.__env || {};
  window.__env.questionBankApiUrl = 'http://localhost:8080/question-bank';
  window.__env.questionCoreApiUrl = 'http://localhost:8585/question-rest';
  window.__env.baseUrl = '/';
  window.__env.enableDebug = true;
}(this));


// prod
/*
(function (window) {
  window.__env = window.__env || {};
  window.__env.questionBankApiUrl = 'http://aq:8080/QuestionBankApp';
  window.__env.questionCoreApiUrl = 'http://aq:8080/QuestionCoreApp';
  window.__env.baseUrl = '/';
  window.__env.enableDebug = true;
}(this));
*/

/*

(function (window) {
  window.__env = window.__env || {};
  window.__env.questionBankApiUrl = 'http://localhost:8080/QuestionBankApp';
  window.__env.questionCoreApiUrl = 'https://aq/QuestionEngineApp';
  window.__env.baseUrl = '/';
  window.__env.enableDebug = true;
}(this));
*/


/*
(function (window) {
  window.__env = window.__env || {};
  window.__env.questionBankApiUrl = 'http://aq:8585/QuestionBankApp';
  window.__env.questionCoreApiUrl = 'http://localhost:8080/question-rest';
  window.__env.baseUrl = '/';
  window.__env.enableDebug = true;
}(this));
*/