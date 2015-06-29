(function(){
	'use strict';

	var app = angular.module("shalat", [
								'geolocation'
							]);

	app.controller("headerCtrl", function($scope){
		$scope.date = new Date();
	});

	app.controller("scheduleCtrl", function($scope, $http, geolocation) {
		var api_key = 'f95c87fd8402d8900320d8af4fa2c2c0';

		// get location from device
		$scope.coords = geolocation.getLocation().then(function(data){
			var kordinat = data.coords.latitude+','+data.coords.longitude;
			console.log('kordinat --> [ '+kordinat+' ]');

			$http.jsonp("http://muslimsalat.com/"+kordinat+"/weekly.json?key="+api_key+"&callback=JSON_CALLBACK").
			// $http.jsonp("http://muslimsalat.com/jakarta/monthly.json?key="+api_key+"&callback=JSON_CALLBACK").
				success(function(data, status, headers, config) {
			  		$scope.prays = data;
					console.log('success load data from muslimsalat');
					console.log(data);

					// today ?
					var startToday = moment().startOf('day').format('YYYY-M-DD hh:mm a');
					$scope.today = moment(startToday).format('x');
					console.log('today     : '+startToday+' --> '+$scope.today);

					// now ?
					$scope.now = moment().format('x');
					console.log('now       : '+moment().format('YYYY-M-DD hh:mm a')+' --> '+$scope.now);

					// end today ?
					$scope.endToday = moment().endOf('day').format('hh:mm a');
					var endTodayFull = moment().endOf('day').format('YYYY-M-DD hh:mm a');
					console.log('end today : '+endTodayFull+' --> '+moment(endTodayFull).format('x'));

					$scope.isToday = function(date){
						var dateToday = moment().format('YYYY-M-DD');
						if(date == dateToday){
							return 'today';
						}
					}

					$scope.isNow = function(date,pray,nextpray){
						var prayTime = moment(date+', '+pray);
						var nextTime = moment(date+', '+nextpray);
						var nowTime  = moment();
						var status = moment(nowTime).isBetween(prayTime , nextTime);
						var past = moment(nowTime).isAfter(nextTime);

						// console.log(prayTime+', '+nowTime+', '+nextTime);

						// console.log(moment(nowTime).format('YYYY-M-DD hh:mm')+' : [ '+moment(prayTime).format('YYYY-M-DD hh:mm')+' - '+moment(nextTime).format('YYYY-M-DD hh:mm')+' ] -- '+status);

						if(status){
							return 'now';
						}
						if(past){
							return 'past';
						}
					}


				}).
				error(function(data, status, headers, config) {
			  		// log error
			  		alert('failed to load data');
				});
	    });

	});

	app.filter('toDateOnly', function () {
		return function (input) {
			var output = moment(input).format('D MMM');
			return output;
		};
	});

	// app.filter('toHH', function () {
	// 	return function (input) {
	// 		var output = moment(input).format('HH:mm');
	// 		return output;
	// 	};
	// });

})();
