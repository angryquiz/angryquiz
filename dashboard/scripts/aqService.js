//http://viralpatel.net/blogs/angularjs-service-factory-tutorial/

var myApp = angular.module('myApp');

myApp.service('AQService', function() {

    this.shuffle = function(array) {
        if(array != undefined || array != null)  {

          var counter = array.length;

          // While there are elements in the array
          while (counter > 0) {
              // Pick a random index
              var index = Math.floor(Math.random() * counter);

              // Decrease counter by 1
              counter--;

              // And swap the last element with it
              var temp = array[counter];
              array[counter] = array[index];
              array[index] = temp;
          }
        }
        return array;
    };

    this.shuffleMap = function(map) {
      
      var mapToArray = [];
      for(var key in map) {
        var value = map[key];
        mapToArray.push(key+'='+value);
      }

      var sh = this.shuffle(mapToArray);

      //Map is not supported in AngularJS
      var arrayOfAnswerMap = [];
      for(var i=0;i<sh.length;i++) {
        var itemS = mapToArray[i].split('=');
        var map2 = new Object();
        map2['key'] = itemS[0];
        map2['value'] = itemS[1];
        arrayOfAnswerMap.push(map2);
      }
      return arrayOfAnswerMap;

    };

    /*
    * Unshuffled. Use for creating and editing questions
    *
    */
    this.unShuffleMap = function(map) {

      var mapToArray = [];
      for(var key in map) {
        var value = map[key];
        mapToArray.push(key+'='+value);
      }

      mapToArray.sort(); //sort it out.

      var sh = mapToArray;

      //Map is not supported in AngularJS
      var arrayOfAnswerMap = [];
      for(var i=0;i<sh.length;i++) {
        var itemS = mapToArray[i].split('=');
        var map2 = new Object();
        map2['key'] = itemS[0];
        map2['value'] = itemS[1];
        arrayOfAnswerMap.push(map2);
      }
      return arrayOfAnswerMap;

    };


});