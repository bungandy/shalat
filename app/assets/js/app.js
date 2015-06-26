'use strict';

var app = angular.module("shalat", ['geolocation']);

app.directive("schedule", function() {
	return {
		restrict: "E",
		templateUrl: "partials/schedule.html"
	};
});

app.directive("header", function() {
	return {
		restrict: "E",
		templateUrl: "partials/header.html"
	};
});

app.directive("footer", function() {
	return {
		restrict: "E",
		templateUrl: "partials/footer.html"
	};
});

app.directive("loading", function() {
	return {
		restrict: "E",
		templateUrl: "partials/loading.html"
	};
});


app.controller("headerCtrl", function($scope){
	$scope.date = new Date();
});

app.controller('geoCtrl', function($scope,geolocation) {
    $scope.coords = geolocation.getLocation().then(function(data){
      return {lat:data.coords.latitude, long:data.coords.longitude};
    });
});

app.controller("locCtrl", function($scope){
	navigator.geolocation.getCurrentPosition(function(position){
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;

		$scope.$apply(function(){
			$scope.lat = lat;
			$scope.lng = lng;
		});

		console.log(position);
	})
});


app.controller("scheduleCtrl", function($scope, $http) {
	var api_key = 'f95c87fd8402d8900320d8af4fa2c2c0';

	// $http.get("jakarta-monthly.json").
	$http.jsonp("http://muslimsalat.com/weekly.json?key="+api_key+"&callback=JSON_CALLBACK").
		success(function(data, status, headers, config) {
	  		$scope.prays = data;
	  		console.log(data);
	  		console.log($scope.prays.items[0].date_for + ' --> ' + typeof($scope.prays.items[0].date_for));
		}).
		error(function(data, status, headers, config) {
	  		// log error
		});

});
