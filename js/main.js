angular.module('game', [])
  
.controller('gameController', ['$scope', '$interval',
  function($scope, $interval) {
	var gameData = this;

	// Calendar
	var counter = 0;
	var year = 1999;
	var currentMonth = "December";
	var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	$scope.date = currentMonth + " " + year;

	// Studio initial data
	$scope.studioTotalPrice = 100000;
	$scope.studioMoneyNeeded = Math.round($scope.studioTotalPrice * 0.2);
	
	// Player initial data
	$scope.playerSavings = 38000;
	$scope.playerDebt = 0;

	// Player properties
	$scope.properties = [];
	// var property ={}	

	// property.totalPrice = $scope.studioTotalPrice;
	// property.mortgage = Math.round(($scope.studioTotalPrice * 0.8 * 1.2) + $scope.studioTotalPrice * 0.8);
	// property.monthlyPayment = Math.round(property.mortgage / 480);
	// property.rent = Math.round($scope.studioTotalPrice / 165);
	// property.cancel = Math.round($scope.studioTotalPrice * 0.8);
	// property.refurbish = Math.round($scope.studioTotalPrice * 0.2);
	// property.devaluation = 0;


	gameData.buy = function() {
		if ($scope.studioMoneyNeeded <= $scope.playerSavings) {
			if (year == 1999) {
				setTimeout(month,1000);
			}
			$scope.properties.push({
				totalPrice: $scope.studioTotalPrice,
				mortgage: Math.round(($scope.studioTotalPrice * 0.8 * 1.2) + $scope.studioTotalPrice * 0.8),
				monthlyPayment: Math.round((($scope.studioTotalPrice * 0.8 * 1.2) + $scope.studioTotalPrice * 0.8) / 480),
				rent: Math.round($scope.studioTotalPrice / 165),
				cancel: Math.round($scope.studioTotalPrice * 0.8),
				refurbish: Math.round($scope.studioTotalPrice * 0.2),
				devaluation: 0
			})

			$scope.playerSavings-= Math.round($scope.studioTotalPrice * 0.2);
			$scope.playerDebt+= Math.round(($scope.studioTotalPrice * 0.8 * 1.2) + $scope.studioTotalPrice * 0.8);

			// console.log($scope.properties);
			setTimeout(propertyStatus,1000)
		}
	};

	// Function to update calendar and studio market price
	function month() {
		$scope.$apply(function(){
			$scope.studioTotalPrice = Math.round($scope.studioTotalPrice + $scope.studioTotalPrice * 0.006);
			$scope.studioMoneyNeeded = Math.round($scope.studioTotalPrice * 0.2);
		});

		if (counter%12 == 0) {
			year+= 1;
			counter = 0;
		}

		// console.log("------------------------------");
		// console.log(monthArray[counter] + " " + year);
		// console.log("studioPrice: " + $scope.studioTotalPrice);
		// console.log("------------------------------");

		$scope.$apply(function(){
			$scope.date = monthArray[counter] + " " + year;
		});
		
		counter +=1;

		setTimeout(month, 1000);
	};

	function propertyStatus() {
		$scope.properties[0].devaluation +=1;
		$scope.properties[0].totalPrice = Math.round($scope.properties[0].totalPrice + $scope.properties[0].totalPrice * (0.006 - ($scope.properties[0].devaluation / 180 * 0.006)));
		$scope.properties[0].refurbish = Math.round($scope.studioTotalPrice * 0.2);

		if ($scope.properties[0].cancel != 0) {
			$scope.properties[0].cancel-= Math.round($scope.properties[0].monthlyPayment * 0.45);
		}

		if ($scope.properties[0].devaluation%12 == 0) {
			$scope.properties[0].rent = Math.round($scope.properties[0].totalPrice / 165);
		}

		if ($scope.playerDebt > 0) {
			$scope.playerSavings+= $scope.properties[0].rent;
			$scope.playerSavings-= $scope.properties[0].monthlyPayment;
			$scope.playerDebt-= $scope.properties[0].monthlyPayment;
		} else {
			$scope.playerDebt = 0;
			$scope.playerSavings+= $scope.properties[0].rent;
		}

		$( ".refurbish" ).click(function() {
			if ($scope.properties[0].refurbish <= $scope.playerSavings && $scope.properties[0].devaluation > 179) {
				$scope.playerSavings-= $scope.properties[0].refurbish;
				$scope.properties[0].devaluation = 0;
				$scope.properties[0].totalPrice+= $scope.properties[0].totalPrice * 0.15;
			};
		});

		$( ".cancel" ).click(function() {
			if ($scope.properties[0].cancel <= $scope.playerSavings) {
				$scope.playerSavings-= $scope.properties[0].cancel;
				$scope.playerDebt-= $scope.properties[0].mortgage;
				$scope.properties[0].mortgage = 0;
				$scope.properties[0].cancel = 0;
			}		
		});

		$( ".sell" ).click(function() {
			$scope.playerSavings+= $scope.properties[0].totalPrice - $scope.properties[0].cancel;
			$scope.playerDebt-= 0;
			$scope.properties.splice(0, 1);

			console.log(properties);
			return;
		});
		
		// console.log("------------------------------");
		// console.log("properties[0]Price: " + $scope.property.totalPrice);
		// console.log("propertyRent: " + $scope.property.rent);
		// console.log("playerSavings: " + $scope.playerSavings);
		// console.log("playerDebt: " + $scope.playerDebt);
		// console.log("cancelMortgage: " + $scope.property.cancel);
		// console.log("propertyRefurbish: " + $scope.property.refurbish);
		// console.log("------------------------------");

		if ($scope.properties.length != 0) {
			setTimeout(propertyStatus, 1000);
		}
	};
}]);
	

