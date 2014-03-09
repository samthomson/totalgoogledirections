var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function initialize($scope) {
  //directionsDisplay = new google.maps.DirectionsRenderer();
  var chicago = new google.maps.LatLng($scope.lat, $scope.lon);
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
	$scope.lat = 41.85003;
	$scope.lon = -87.6500523;

	$scope.journeys = [
		new Journey("copenhagen", "gedser"),
		new Journey("rostock", "berlin"),
		new Journey("berlin", "talinn")
	];
	
    
	$scope.addJourney = function(start, end) {
		$scope.journeys.push(new Journey(start, end));
		$scope.calculateDistance($scope.journeys.length-1);
	}
	
	$scope.deleteJourney = function(index){
		$scope.journeys.splice(index, 1);
	}
	
	
    $scope.totalDistance = function () {
		var iTotal = 0;
		$scope.journeys.forEach(function(journey){
			if(journey.include)
				if(!isNaN(journey.distance))
					iTotal += journey.distance;
		});
		return numberWithCommas(iTotal/1000) + " km";
	}
	
	$scope.redrawMap = function(){
		initialize($scope);
		$scope.journeys.forEach(function(journey){
			journey.render();
		});
		// now update the lat/lon values to map pos for the next render
		$scope.lat = map.getCenter().lat;
		$scope.lon = map.getCenter().lng;		
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
					$scope.journeys[index].result = result;
					// distance as an absolute number
					$scope.journeys[index].distance = result.routes[0].legs[0].distance.value;
					//$scope.journeys[index].render();
					// force ui to update
					$scope.$apply();
				}else{
					return "error :(";
				}
			});
	};

	function Journey(start, end){
		// Add object properties like this
		this.start = start;
		this.end = end;
		this.distance = "loading..";
		this.include = true;
		
		this.lineColour = 'FF0000';
		
		//this.distance = calculateDistance();
		
		this.render = function(){
			// make directions renderer for this journye
			this.directionsRenderer = new google.maps.DirectionsRenderer(
				{
					suppressInfoWindows: true,
					suppressMarkers: true,
					polylineOptions: {strokeColor: '#' + this.lineColour, width:1}
				}
			);
			if(this.directionsRenderer){
				this.directionsRenderer.setMap(null);
			}
			this.directionsRenderer.setMap(map);
			if(this.include && this.result){
				this.directionsRenderer.setDirections(this.result);
				//this.result = null;
			}
		};
	}
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}