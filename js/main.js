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

	// Initial data
	$scope.studioPrice = 100000;
	$scope.flatPrice = 200000;
	$scope.penthousePrice = 500000;
	$scope.villaPrice = 1000000;
	$scope.blockPrice = 2000000;
	$scope.towerPrice = 5000000;
	$scope.studio = "studio";
	$scope.apartment = "apartment";
	$scope.penthouse = "penthouse";
	$scope.villa = "villa";
	$scope.block = "block";
	$scope.tower = "tower";
	
	// Player initial data
	$scope.playerSavings = 38000;
	$scope.playerDebt = 0;

	// Player properties
	$scope.properties = [];

	gameData.buy = function(propertyType, stringType) {
		$scope.generalTotalPrice = propertyType;
		$scope.moneyNeeded = Math.round($scope.generalTotalPrice * 0.2);
		$scope.typeString = stringType

		if ($scope.moneyNeeded <= $scope.playerSavings) {

			$scope.properties.push({
				propertyIs: $scope.typeString,
				totalPrice: $scope.generalTotalPrice,
				marketPrice: $scope.generalTotalPrice,
				mortgage: Math.round(($scope.generalTotalPrice * 0.8 * 1.2) + $scope.generalTotalPrice * 0.8),
				monthlyPayment: Math.round((($scope.generalTotalPrice * 0.8 * 1.2) + $scope.generalTotalPrice * 0.8) / 480),
				rent: Math.round($scope.generalTotalPrice / 165),
				cancel: Math.round($scope.generalTotalPrice * 0.8),
				refurbish: Math.round($scope.generalTotalPrice * 0.2),
				devaluation: 0,
				colorSell: "none",
				colorCancel: "none",
				colorRefurbish: "none"
			})

			$scope.playerSavings-= Math.round($scope.generalTotalPrice * 0.2);
			$scope.playerDebt+= Math.round(($scope.generalTotalPrice * 0.8 * 1.2) + $scope.generalTotalPrice * 0.8);

			if (year == 1999) {
				setTimeout(month,100);
			}
			if ($scope.properties.length == 1) {
				setTimeout(propertyStatus,100);
			}
		}
	};

	// Function to update calendar and general market price
	function month() {
		if ((year % 100 <= 35) || ((year % 100 <= 85) && (year % 100 > 50))) {
			$scope.recession = 0.003;
		} else {
			$scope.recession = -0.005;
		}

		$scope.$apply(function(){
			$scope.studioPrice = Math.round($scope.studioPrice + $scope.studioPrice * $scope.recession);
			$scope.flatPrice = Math.round($scope.flatPrice + $scope.flatPrice * $scope.recession);
			$scope.penthousePrice = Math.round($scope.penthousePrice + $scope.penthousePrice * $scope.recession);
			$scope.villaPrice = Math.round($scope.villaPrice + $scope.villaPrice * $scope.recession);
			$scope.blockPrice = Math.round($scope.blockPrice + $scope.blockPrice * $scope.recession);
			$scope.towerPrice = Math.round($scope.towerPrice + $scope.towerPrice * $scope.recession);
		});

		if (counter%12 == 0) {
			year+= 1;
			counter = 0;
		}

		$scope.$apply(function(){
			$scope.date = monthArray[counter] + " " + year;
			$scope.playerSavings+= Math.round($scope.playerSavings * 0.001);
		});

		counter +=1;
		setTimeout(month, 100);
	};

	function propertyStatus() {
		if (($scope.studioPrice * 0.2) > $scope.playerSavings) {
			$( ".studio" ).removeClass( "green" );
			$( ".flat" ).removeClass( "green" );
			$( ".penthouse" ).removeClass( "green" );
			$( ".villa" ).removeClass( "green" );
			$( ".block" ).removeClass( "green" );
			$( ".tower" ).removeClass( "green" );
		} else if (($scope.flatPrice * 0.2) > $scope.playerSavings) {
			$( ".studio" ).addClass( "green" );
			$( ".flat" ).removeClass( "green" );
			$( ".penthouse" ).removeClass( "green" );
			$( ".villa" ).removeClass( "green" );
			$( ".block" ).removeClass( "green" );
			$( ".tower" ).removeClass( "green" );
		} else if (($scope.penthousePrice * 0.2) > $scope.playerSavings) {
			$( ".flat" ).addClass( "green" );
			$( ".penthouse" ).removeClass( "green" );
			$( ".villa" ).removeClass( "green" );
			$( ".block" ).removeClass( "green" );
			$( ".tower" ).removeClass( "green" );
		} else if (($scope.villaPrice * 0.2) > $scope.playerSavings) {
			$( ".penthouse" ).addClass( "green" );
			$( ".villa" ).removeClass( "green" );
			$( ".block" ).removeClass( "green" );
			$( ".tower" ).removeClass( "green" );
		} else if (($scope.blockPrice * 0.2) > $scope.playerSavings) {
			$( ".villa" ).addClass( "green" );
			$( ".block" ).removeClass( "green" );
			$( ".tower" ).removeClass( "green" );
		} else if (($scope.towerPrice * 0.2) > $scope.playerSavings) {
			$( ".block" ).addClass( "green" );
			$( ".tower" ).removeClass( "green" );
		} else if (($scope.towerPrice * 0.2) > $scope.playerSavings) {
			$( ".tower" ).addClass( "green" );
		};

		if ($scope.properties.length != 0) {
			for (i=0; i<$scope.properties.length; i++) {
				$scope.properties[i].marketPrice = Math.round($scope.properties[i].marketPrice + ($scope.properties[i].marketPrice * $scope.recession));

				$scope.properties[i].devaluation +=1;

				if ($scope.properties[i].devaluation > 179) {
					$scope.properties[i].totalPrice = Math.round($scope.properties[i].totalPrice + ($scope.properties[i].totalPrice * $scope.recession));
				} else {
					$scope.properties[i].totalPrice = Math.round($scope.properties[i].totalPrice + $scope.properties[i].totalPrice * ($scope.recession - ($scope.properties[i].devaluation / 450 * $scope.recession)));
				}

				$scope.properties[i].refurbish = Math.round($scope.properties[i].marketPrice * 0.2);

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
						$scope.properties[$index].totalPrice = $scope.properties[$index].marketPrice;
					};
				};

				if ($scope.properties[i].cancel <= $scope.playerSavings) {
					if ($scope.properties[i].cancel > 0) {
						$scope.properties[i].colorCancel = "green";
					} else {
						$scope.properties[i].colorCancel = "none";
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
			
			setTimeout(propertyStatus, 100);
    	}
	};
}]);