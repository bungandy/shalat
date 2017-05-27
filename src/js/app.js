var app = angular.module('shalat', ['ngRoute','geolocation'])

.controller('scheduleCtrl', ['$scope', '$http', '$interval','geolocation', function($scope, $http, $interval,geolocation) {

	$interval(function(){
        $scope.today = moment(new Date()).format('D MMM YYYY - HH:mm:ss');
    },1000);

    // get location from device
	$scope.coords = geolocation.getLocation().then(function(position){
		var lat 		= position.coords.latitude,
			lng 		= position.coords.longitude,
			geocoder 	= new google.maps.Geocoder(),
			latlng 		= new google.maps.LatLng(lat,lng);

		// console.log('lat: ['+lat+']\nlng: ['+lng+']');

		// convert current geolocation to city name
		geocoder.geocode({'latLng': latlng}, function (results, status){
	        if (status == google.maps.GeocoderStatus.OK){

	            if (results){
	            	var cityname 	= results[5].address_components[0].long_name;
	            	getPrayByCity(cityname);
	            }
	            else{
	                alert('No results found');
	            }
	        }
	        else{
	            alert('Geocoder failed due to: ' + status);
	        }
	    });
	});

	function getPrayByCity(cityname){
		var muslimKey = 'f95c87fd8402d8900320d8af4fa2c2c0';		// key Muslimshalat.com - andy@mineral.co.id:andy1234
		var date = moment(new Date()).format('DD-MM-YYYY');
		var url = 'https://muslimsalat.com/'+cityname+'/monthly/'+date+'.json?key='+muslimKey;

		$http.jsonp(url)
			.then(function(response){
				var data = response.data;
		    	// console.log(data);

		    	$scope.prays = data.items;
		    	$scope.location = data;
			});
	}

    // Add class now / past
    $scope.endToday = moment().endOf('day');
	$scope.isPrayNow = function(datePray, timePrayA,timePrayB){
		var timeServer 	= moment.utc(new Date()),

			datePray 	= moment(new Date(datePray)).format('YYYY-MM-DD'),
			timePray 	= moment.utc(new Date(datePray+' '+timePrayA)),
			timePrayNext= moment.utc(new Date(datePray+' '+timePrayB)).subtract(12,'minutes'),

			statusNow 	= moment(new Date(timeServer)).isBetween(new Date(timePray) , new Date(timePrayNext)),
			statusPast 	= moment(new Date(timeServer)).isAfter(new Date(timePrayNext));

		if(statusNow){
			return 'now';
		}
		if(statusPast){
			return 'past';
		}
	}

	// Add class today
    $scope.isToday = function(input){
		var dateServer 	= moment(new Date()).format('YYYY-M-DD'),
			datePray 	= moment(input,'YYYY-M-DD').format('YYYY-M-DD');

		if(datePray == dateServer){
			return 'today';
		}
	}

}])

.filter('toDate', function(){
	return function(input) {
		var output = moment(input,'YYYY-M-DD').format('D');
		return output;
	};
})

.filter('toTime', function(){
	return function(input) {
		var output = moment(input,'H:m a').format('HH:mm');
		return output;
	};
})

.config(['$routeProvider','$sceDelegateProvider', function($routeProvider, $sceDelegateProvider){
	$routeProvider
		.when('/',{
			templateUrl: 'index.html',
			controller: 'scheduleCtrl'
		})
		.otherwise({redirectTo: '/'});

	$sceDelegateProvider.resourceUrlWhitelist([
		'self',
		'https://muslimsalat.com/**'
	]);

}]);