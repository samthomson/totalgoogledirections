var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var app = angular.module('myApp', ['google-maps']);

app.run(function($rootScope) {
});
	
app.controller('journeys', function($scope){	
	$scope.lat = 0;
	$scope.lon = 0;
	$scope.zoom = 1;

	$scope.map = {
	    center: {
	        latitude: $scope.lat,
	        longitude: $scope.lon
	    },
	    zoom: $scope.zoom
	};

	//$scope.journeys = [{start:"copenhagen",end:"roskilde", include: true, key: guid()}];
	$scope.journeys = [];
	
    
	$scope.addJourney = function() {
		var sStart = ($scope.journeys.length > 0) ? $scope.journeys[$scope.journeys.length-1].end : "";
		$scope.journeys.push(new Journey(sStart, "", guid()));
		//$scope.calculateDistance($scope.journeys.length-1);
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
	
	$scope.calculateDistance = function(index){
		if($scope.journeys[index].start != "" && $scope.journeys[index].end != ""){
			var request = {
				origin: $scope.journeys[index].start,
				destination: $scope.journeys[index].end,
				travelMode: google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {

					$scope.journeys[index].path = [];

					result.routes.forEach(function(route){
						route.legs.forEach(function(leg){
							leg.steps.forEach(function(step){
								var oaLL = {"latitude": step.start_location.k, "longitude": step.start_location.B};
								$scope.journeys[index].path.push(oaLL);
							});
						});
					});

					$scope.journeys[index].result = result.routes[0].legs[0].steps[0].polyline;




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

	function Journey(start, end, guid){
		// Add object properties like this
		this.key = guid;
		this.start = start;
		this.end = end;
		this.distance = 0;
		this.literalDistance = function(){
			return (this.distance == 0) ? this.distance : this.distance/1000 + " km";
		}
		this.include = true;
		// array of lat lons making up route
		this.path = [{"latitude":0,"longitude":0}];
		
		this.lineColour = 'FF0000';
	}
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();