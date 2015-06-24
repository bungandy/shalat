'use strict';

angular.module('shalat.schedule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'partials/schedule.html',
    controller: 'scheduleCtrl'
  });
}])

.controller('scheduleCtrl', [function() {

}]);