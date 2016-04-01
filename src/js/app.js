var app = angular.module('shalat', ['geolocation'])

	.controller('headerCtrl', ['$scope', '$interval', function($scope, $interval){
		$scope.date = moment(new Date()).format('D MMM YYYY');
		$interval(function(){
	        $scope.time = moment().format('HH:mm:ss');
	    },1000);
	}])

	.controller('scheduleCtrl', ['$scope', '$http', 'geolocation', function($scope, $http, geolocation) {

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
					url: 'http://api.aladhan.com/calendarByCity?city='+cityname+'&country='+countryname
					})
		    		.then(function successCallback(response) {
		    			var data = response.data;

						$scope.prays = data;
				  		// console.log($scope.prays);

					}, function errorCallback(response) {
						console.log('retry');
						// called asynchronously if an error occurs
						// or server returns response with an error status.
					}
				);
		    }

		    $scope.isToday = function(input){
				var dateServer 	= moment(new Date()).format('D'),
					datePray 	= moment.unix(input).format('D');

				if(datePray == dateServer){
					return 'today';
				}
			}

			$scope.isPrayNow = function(datePray, timePrayA,timePrayB){
				var timeServer 	= moment.utc(new Date()),

					datePray 	= moment(new Date(datePray)).format('MM DD YYYY'),
					timePray 	= moment.utc(new Date(datePray+' '+timePrayA)),
					timePrayNext= moment.utc(new Date(datePray+' '+timePrayB)).subtract(10,'minutes'),

					statusNow 	= moment(new Date(timeServer)).isBetween(new Date(timePray) , new Date(timePrayNext)),
					statusPast 	= moment(new Date(timeServer)).isAfter(new Date(timePrayNext));

				// console.log('\n\ntime server : ');
				// console.log(timeServer);
				// console.log('===');
				// console.log('time pray   : ');
				// console.log(timePray);
				// console.log('===');
				// console.log('next pray   : ');
				// console.log(timePrayNext);
				// console.log('===');
				// console.log('now : '+statusNow, '\npast : '+statusPast);
				// console.log('-------------');

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

	.filter('toDate', function () {
		return function (input) {
			var output = moment.unix(input).format('D');
			return output;
		};
	})
;