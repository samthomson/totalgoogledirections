var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function initialize() {
	console.log("initialised");
  //directionsDisplay = new google.maps.DirectionsRenderer();
  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  var mapOptions = {
    zoom:7,
    center: chicago
  }
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  //directionsDisplay.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);


var app = angular.module('myApp', []);

app.run(function($rootScope) {
});
	
app.controller('journeys', function($scope){	
	$scope.journeys = [
		new Journey("copenhagen", "gedser"),
		new Journey("rostock", "athens")
	];
    
	$scope.addJourney = function() {
		$scope.journeys.push(new Journey("", ""));
	}
	
    $scope.totalDistance = function () {
		var iTotal = 0;
		$scope.journeys.forEach(function(journey){
			iTotal += journey.distance;
		});
		console.log(iTotal);
		return numberWithCommas(iTotal/1000) + " km";
	}
	
	$scope.calculateDistance = function(index){
		//$scope.journeys[index].distance();
		
		var request = {
				origin: $scope.journeys[index].start,
				destination: $scope.journeys[index].end,
				travelMode: google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					console.log(result.routes[0].legs[0].distance.value);
					$scope.journeys[index].distance = result.routes[0].legs[0].distance.value;
					$scope.journeys[index].directionsRenderer = new google.maps.DirectionsRenderer({suppressInfoWindows: true, suppressMarkers: true, polylineOptions: {strokeColor: '#FF0000'}});
					$scope.journeys[index].directionsRenderer.setMap(map);
      				$scope.journeys[index].directionsRenderer.setDirections(result);
					$scope.$apply();
				}else{
					return "error :(";
				}
			});
	};

	function Journey(start, end){
		console.log("journey created");
		// Add object properties like this
		this.start = start;
		this.end = end;
		this.distance = "loading..";
	}
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}