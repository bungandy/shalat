var app = angular.module('shalat', ['ngRoute','metatags','geolocation'])

.controller('scheduleCtrl', ['$scope', '$http', '$interval', 'geolocation', function($scope, $http, $interval, geolocation) {

	$interval(function(){
        $scope.today = moment(new Date()).format('D MMM YYYY - HH:mm:ss');
    },1000);

	// get location from device
	$scope.coords = geolocation.getLocation().then(function(position){
		var lat 		= position.coords.latitude,
			lng 		= position.coords.longitude,
			geocoder 	= new google.maps.Geocoder(),
			latlng 		= new google.maps.LatLng(lat,lng);

		console.log('lat: ['+lat+']\nlng: ['+lng+']');

		// convert current geolocation to city name
		geocoder.geocode({'latLng': latlng}, function (results, status){
	        if (status == google.maps.GeocoderStatus.OK){

	            if (results){
	            	var cityname 	= results[5].address_components[0].long_name,
	            		countryname	= results[5].address_components[2].short_name;

	            	// console.log(results);
	            	console.log(cityname, countryname);

	            	getPrayByCity(cityname,countryname);

	            	$scope.location = results;

	            }
	            else{
	                alert('No results found');
	            }
	        }
	        else{
	            alert('Geocoder failed due to: ' + status);
	        }
	    });

	    function getPrayByCity(cityname,countryname){
	    	$http({
				method: 'GET',
				url: 'https://api.aladhan.com/calendarByCity?city='+cityname+'&country='+countryname
				})
	    		.then(function successCallback(response) {
	    			var data = response.data;
					$scope.prays = data;

					var today = moment.utc(new Date()).format('D'),
						prayToday = data.data[today-1],
						todayPrayShare  = prayToday.date.readable+' -- '+'Subuh: '+prayToday.timings.Fajr+' ';
						todayPrayShare += 'Dhuhr: '+prayToday.timings.Dhuhr+' ';
						todayPrayShare += 'Asr: '+prayToday.timings.Asr+' ';
						todayPrayShare += 'Maghrib: '+prayToday.timings.Maghrib+' ';
						todayPrayShare += 'Isha: '+prayToday.timings.Isha;

					$scope.todayPrayText = todayPrayShare;

				    // console.log($scope.metadata.description);

				}, function errorCallback(response) {
					console.log('retry');
				}
			);
	    }


	    // Add class today
	    $scope.isToday = function(input){
			var dateServer 	= moment(new Date()).format('D'),
				datePray 	= moment.unix(input).format('D');

			if(datePray == dateServer){
				return 'today';
			}
		}

		// Add class now / past
		$scope.isPrayNow = function(datePray, timePrayA,timePrayB){
			var timeServer 	= moment.utc(new Date()),

				datePray 	= moment(new Date(datePray)).format('MM DD YYYY'),
				timePray 	= moment.utc(new Date(datePray+' '+timePrayA)),
				timePrayNext= moment.utc(new Date(datePray+' '+timePrayB)).subtract(10,'minutes'),

				statusNow 	= moment(new Date(timeServer)).isBetween(new Date(timePray) , new Date(timePrayNext)),
				statusPast 	= moment(new Date(timeServer)).isAfter(new Date(timePrayNext));

			if(statusNow){
				return 'now';
			}
			if(statusPast){
				return 'past';
			}
		}

		$scope.endToday = moment().endOf('day');

    });

}])

.filter('toDate', function(){
	return function(input) {
		var output = moment.unix(input).format('D');
		return output;
	};
})

.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl: 'index.html',
			controller: 'scheduleCtrl'
		})
		.otherwise({redirectTo: '/'});
}]);

// .config(['$routeProvider','MetaTagsProvider', function($routeProvider, MetaTagsProvider){
// 	$routeProvider
// 		.when('/',{
// 			templateUrl: 'index.html',
// 			controller: 'scheduleCtrl'
// 		})
// 		.otherwise({redirectTo: '/'});

// 	MetaTagsProvider
// 		.when('/', {
// 			title: 'Shalat.co',
// 			url: 'http://www.shalat.co',
// 			description: 'Pray Times based on your current location.',
// 			og_image_large: 'http://mineral-static.s3-ap-southeast-1.amazonaws.com/shalatco/og_image_1200x650.png',
// 			og_image_small: 'http://mineral-static.s3-ap-southeast-1.amazonaws.com/shalatco/og_image_600x330.png',
// 			fb_appid: '1092565430796049'
// 		});
// }])

// .run(['MetaTags', function(MetaTags){
//     MetaTags.initialize();
// }]);