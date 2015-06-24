'use strict';

var app = angular.module("shalat", []);

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

	app.directive("manuallocation", function() {
		return {
			restrict: "E",
			templateUrl: "partials/mod_manual_location.html"
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


app.controller('scheduleCtrl', function($scope){
	$scope.schedList = [
	{
		date	: '1',
		time	: {
			subuh  : '04:40',
			dzuhur : '11:55',
	        ashar  : '15:17',
	        magrib : '17:48',
	        isya   : '19:03',
		}
	},
	{
		date   : '2',
		time	: {
			subuh  : '04:40',
			dzuhur : '11:55',
	        ashar  : '15:17',
	        magrib : '17:48',
	        isya   : '19:03',
		}
	},
	{
		date   : '3',
		time	: {
			subuh  : '04:40',
			dzuhur : '11:55',
	        ashar  : '15:17',
	        magrib : '17:48',
	        isya   : '19:03',
		}
	},
	];
});