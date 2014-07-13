var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var app = angular.module('myApp', ['google-maps']).
	directive('googlePlaces', function(){
	    return {
	        restrict:'E',
	        replace:true,
	        // transclude:true,
	        scope: {location:'='},
	        template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>',
	        link: function($scope, elm, attrs){
	            var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
	            google.maps.event.addListener(autocomplete, 'place_changed', function() {
	                var place = autocomplete.getPlace();
	                $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
	                $scope.$apply();
	            });
	        }
	    }
	});

app.run(function($rootScope) {
});
	
app.controller('journeys', function($scope){	
	$scope.lat = 41.85003;
	$scope.lon = -87.6500523;

	$scope.map = {
    center: {
        latitude: $scope.lat,
        longitude: $scope.lon
    },
    zoom: 8
};

	$scope.journeys = [{start:"copenhagen",end:"hanoi"}];
	
    
	$scope.addJourney = function() {
		var sStart = ($scope.journeys.length > 0) ? $scope.journeys[$scope.journeys.length-1].end : "";
		$scope.journeys.push(new Journey(sStart, ""));
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
		if($scope.journeys[index].start != "" && $scope.journeys[index].end != ""){
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
		}else{
			// inputs were invalid
			
		}
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

			this.lineColour = (this.include) ? 'FF0000' : 'C0C0C0';
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
			if(this.result){
				this.directionsRenderer.setDirections(this.result);
				//this.result = null;
			}
		};
	}
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}