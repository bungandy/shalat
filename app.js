'use strict';

angular.module('app',['ngRoute','geolocation'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'index.html'
	})
	.otherwise({redirectTo: '/'});
}])


//Filter
.filter('toDateOnly', function () {
		return function (input) {
			var output = moment(input).format('D MMM');
			return output;
		};
})


//Header Controller
.controller("headerCtrl", function($scope, $interval){
	$scope.date = moment(new Date()).format('DD MMM YYYY');
	$interval(function(){
        $scope.time = moment().format('HH:mm:ss');
    },1000);
})


//Schedule Controller
.controller("scheduleCtrl", function($scope, $http, geolocation) {
	var api_key = 'f95c87fd8402d8900320d8af4fa2c2c0';

	// get location from device
	$scope.coords = geolocation.getLocation().then(function(position){
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		console.log('Kordinat --> [ lat:'+lat+' -- lng:'+lng+' ]');

		$http.jsonp("https://muslimsalat.com/"+lat+","+lng+"/monthly.json?key="+api_key+"&callback=JSON_CALLBACK").
			success(function(data, status, headers, config) {
		  		$scope.prays = data;
				console.log('success load data from muslimsalat\n|\nv');
				console.log(data);

				get_today();
				pray_status();

				//if muslimsalat don't know the kordinat
				if($scope.prays.status_code==0){
					var status = $scope.prays.status_error.invalid_query;
					console.log(status);

					getPrayByCity(lat,lng);
					
				}

			});
			// error(function(data, status, headers, config) {
			// 	// log error
			// 	alert('failed to load data');
			// });

	    function getPrayByCity(input){
	    	var geocoder = new google.maps.Geocoder();
			var latlng = new google.maps.LatLng(lat,lng);
		    geocoder.geocode({'latLng': latlng}, function (results, status){
		        if (status == google.maps.GeocoderStatus.OK)
		        {
		            if (results[0])
		            {
		                var kordinat = results[0].address_components[5].long_name;

		                $http.jsonp("http://muslimsalat.com/"+kordinat+"/monthly.json?key="+api_key+"&callback=JSON_CALLBACK").
							success(function(data, status, headers, config) {
						  		$scope.prays = data;
								console.log('success load data from muslimsalat\n|\nv');
								console.log(data);

								get_today();
								pray_status();

							});
		            }
		            else
		            {
		                alert("No results found");
		            }
		        }
		        else
		        {
		            alert("Geocoder failed due to: " + status);
		        }

		        console.log(results[0].address_components[5].long_name);
		    });
	    }

		
    });

	

	function get_today(){
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

	} //get_today

	function pray_status(){
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
	} //pray_status

});
