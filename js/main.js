angular.module('game', [])
  
.controller('gameController', ['$scope',
  function($scope) {
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

	gameData.buy = function() {
		if ($scope.studioMoneyNeeded <= $scope.playerSavings) {

			$scope.properties.push({
				totalPrice: $scope.studioTotalPrice,
				mortgage: Math.round(($scope.studioTotalPrice * 0.8 * 1.2) + $scope.studioTotalPrice * 0.8),
				monthlyPayment: Math.round((($scope.studioTotalPrice * 0.8 * 1.2) + $scope.studioTotalPrice * 0.8) / 480),
				rent: Math.round($scope.studioTotalPrice / 165),
				cancel: Math.round($scope.studioTotalPrice * 0.8),
				refurbish: Math.round($scope.studioTotalPrice * 0.2),
				devaluation: 0,
				colorSell: "none",
				colorCancel: "none",
				colorRefurbish: "none"
			})

			$scope.playerSavings-= Math.round($scope.studioTotalPrice * 0.2);
			$scope.playerDebt+= Math.round(($scope.studioTotalPrice * 0.8 * 1.2) + $scope.studioTotalPrice * 0.8);

			if (year == 1999) {
				setTimeout(month,1000);
			}
			if ($scope.properties.length == 1) {
				setTimeout(propertyStatus,1000);
			}
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

		$scope.$apply(function(){
			$scope.date = monthArray[counter] + " " + year;
			$scope.playerSavings+= Math.round($scope.playerSavings * 0.0025);
		});
		
		counter +=1;
		setTimeout(month, 1000);
	};

	function propertyStatus() {
		if (($scope.studioMoneyNeeded > $scope.playerSavings)) {
			$( ".buy" ).removeClass( "green" );
		} else {
			$( ".buy" ).addClass( "green" );
		};

		if ($scope.properties.length != 0) {
			for (i=0; i<$scope.properties.length; i++) {
				$scope.properties[i].devaluation +=1;

				if ($scope.properties[i].devaluation > 179) {
					console.log($scope.properties[i].devaluation);
					$scope.properties[i].totalPrice = Math.round($scope.properties[i].totalPrice + ($scope.properties[i].totalPrice * 0.006));
				} else {
					$scope.properties[i].totalPrice = Math.round($scope.properties[i].totalPrice + $scope.properties[i].totalPrice * (0.006 - ($scope.properties[i].devaluation / 450 * 0.006)));
				}

				$scope.properties[i].refurbish = Math.round($scope.studioTotalPrice * 0.2);

				if ($scope.properties[i].cancel > 0) {
					$scope.properties[i].cancel-= Math.round($scope.properties[i].monthlyPayment * 0.45);
				} else {
					$scope.properties[i].cancel = 0;
				}

				if ($scope.properties[i].devaluation%12 == 0) {
					$scope.properties[i].rent = Math.round($scope.properties[i].totalPrice / 165);
				}

				if ($scope.playerDebt > 0) {
					$scope.properties[i].mortgage-= $scope.properties[i].monthlyPayment;
					$scope.playerSavings+= $scope.properties[i].rent;
					$scope.playerSavings-= $scope.properties[i].monthlyPayment;
					$scope.playerDebt-= $scope.properties[i].monthlyPayment;
				} else {
					$scope.playerDebt = 0;
					$scope.playerSavings+= $scope.properties[i].rent;
				}

				if ($scope.properties[i].refurbish <= $scope.playerSavings && $scope.properties[i].devaluation > 179) {
					$scope.properties[i].colorRefurbish = "green";

					gameData.refurbish = function($index) {
						$scope.properties[$index].colorRefurbish = "none";
						$scope.playerSavings-= $scope.properties[$index].refurbish;
						$scope.properties[$index].devaluation = 0;
						$scope.properties[$index].totalPrice = $scope.studioTotalPrice;
					};
				};

				if ($scope.properties[i].cancel <= $scope.playerSavings) {
					if ($scope.properties[i].cancel > 0) {
						$scope.properties[i].colorCancel = "green";
					};

					gameData.cancel = function($index) {
						$scope.properties[$index].colorCancel = "none";
						$scope.playerSavings-= $scope.properties[$index].cancel;
						$scope.playerDebt-= $scope.properties[$index].mortgage;
						$scope.properties[$index].mortgage = 0;
						$scope.properties[$index].cancel = 0;
						$scope.properties[$index].monthlyPayment = 0;
					};
				}		

				if ($scope.properties[i].devaluation > 12) {
					$scope.properties[i].colorSell = "green";
				};

				gameData.sell = function($index) {
					if ($scope.properties[$index].devaluation > 12) {
						$scope.playerSavings+= $scope.properties[$index].totalPrice - $scope.properties[$index].cancel;
						$scope.playerDebt-= $scope.properties[$index].mortgage;
						$scope.properties.splice([$index], 1);
					};
				};				
			}
			
			setTimeout(propertyStatus, 1000);
    	}
	};
}]);