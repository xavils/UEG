angular.module('game', [])
  
.controller('gameController', ['$scope',
  function($scope) {
	var gameData = this;

	$( document ).ready(startGameData());

	function startGameData() {
		// Calendar
		$scope.counter = 0;
		$scope.year = 1999;
		$scope.currentMonth = "December";
		$scope.monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		$scope.date = $scope.currentMonth + " " + $scope.year;
		$scope.recessionStatus = "BOOM";

		// Initial property data
		$scope.studioPrice = 100000;
		$scope.flatPrice = 200000;
		$scope.penthousePrice = 500000;
		$scope.villaPrice = 1000000;
		$scope.blockPrice = 2000000;
		$scope.towerPrice = 5000000;
		$scope.complexPrice = 15000000;
		$scope.urbanPrice = 50000000;

		$scope.studio = "STUDIO";
		$scope.apartment = "APARTMENT";
		$scope.penthouse = "PENTHOUSE";
		$scope.villa = "VILLA";
		$scope.block = "BLOCK";
		$scope.tower = "TOWER";
		$scope.complex = "COMPLEX";
		$scope.urban = "TOWN";
		
		// Player initial data
		$scope.playerSavings = 38000;
		$scope.playerDebt = 0;
		$scope.netWorth = $scope.playerSavings - $scope.playerDebt;
		$scope.totalRent = 0;
		$scope.totalMonthlyMortgage = 0;
		$scope.properties = [];

		// Game initial settings
		$('.propertyList').hide();
		$('.gameOver').hide();
		$scope.currentSpeed = 10;
	}

	// Buy 1 property actions
	gameData.buy = function(propertyType, stringType) {
		// Gather propertyType data from click
		$scope.generalTotalPrice = propertyType;
		$scope.moneyNeeded = Math.round($scope.generalTotalPrice * 0.2);
		$scope.typeString = stringType;

		// Make sure player can actually buy
		if (($scope.moneyNeeded <= $scope.playerSavings) && ($scope.properties.length < 15)) {
			// Add new property to properties[]
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

			// Update player data
			$scope.playerSavings-= Math.round($scope.generalTotalPrice * 0.2);
			$scope.playerDebt+= Math.round(($scope.generalTotalPrice * 0.8 * 1.2) + $scope.generalTotalPrice * 0.8);

			// Start the game / time function
			if ($scope.year == 1999) {
				setTimeout(month, $scope.currentSpeed);
				$('.howToPlay').hide();
				$('.propertyList').show();
			}

			// If player had sold all properties, restart the propertyStatus function
			if ($scope.properties.length == 1) {
				setTimeout(propertyStatus, $scope.currentSpeed);
			}
		}
	};

	// Update calendar and general market price
	function month() {
		boomRecession();

		// Update properties market price
		$scope.$apply(function(){
			$scope.studioPrice = Math.round($scope.studioPrice + $scope.studioPrice * $scope.recession);
			$scope.flatPrice = Math.round($scope.flatPrice + $scope.flatPrice * $scope.recession);
			$scope.penthousePrice = Math.round($scope.penthousePrice + $scope.penthousePrice * $scope.recession);
			$scope.villaPrice = Math.round($scope.villaPrice + $scope.villaPrice * $scope.recession);
			$scope.blockPrice = Math.round($scope.blockPrice + $scope.blockPrice * $scope.recession);
			$scope.towerPrice = Math.round($scope.towerPrice + $scope.towerPrice * $scope.recession);
			$scope.complexPrice = Math.round($scope.complexPrice + $scope.complexPrice * $scope.recession);
			$scope.urbanPrice = Math.round($scope.urbanPrice + $scope.urbanPrice * $scope.recession);
		});

		// +1 Year
		if ($scope.counter%12 == 0) {
			$scope.year+= 1;
			$scope.counter = 0;
		}

		// Update date and apply savings interest
		$scope.$apply(function(){
			$scope.date = $scope.monthArray[$scope.counter] + " " + $scope.year;
			$scope.playerSavings+= Math.round($scope.playerSavings * 0.001);
			// The score
			$scope.netWorth = $scope.playerSavings - $scope.playerDebt + $scope.totalPropertiesPrice;
		});

		// End the game
		if ($scope.year == 2100) {
			$('.propertyList').hide();
			$('.gamingData').hide();
			$('.gameOver').show();

			$scope.$apply(function(){
				// Game over message
				if ($scope.netWorth > 1000000000) {
					$scope.gameOver = "Congrats. You are richer than Donald Trump!";
				} else if ($scope.netWorth < 1000000) {
					$scope.gameOver = "Game Over! You really tried your best to stay poor(ish).";
				} else {
					$scope.gameOver = "Game Over! You are dead and failed to become filthy rich.";
				}

				// Store highscore
				if ($scope.netWorth > Number(localStorage.highScore) || typeof localStorage.highScore === 'undefined') {
		    	localStorage.highScore = $scope.netWorth;
		    	$scope.highScore = localStorage.getItem("highScore");
		    } else {
		    	$scope.highScore = localStorage.getItem("highScore");
		    }

		    twitter();
			});

			return;
		}

		$scope.counter +=1;
		setTimeout(month, $scope.currentSpeed);
	};

	// Real-time update all game money data
	function propertyStatus() {
		// Data freeze on game over
		if ($scope.year == 2100) {
			return;
		}

		// Refresh monthly data
		$scope.totalPropertiesPrice = 0;
		$scope.totalRent = 0;
		$scope.totalMonthlyMortgage = 0;

		// Manage button color
		if ($scope.properties.length < 15) {
			if (($scope.studioPrice * 0.2) < $scope.playerSavings) {
				$( ".studio" ).addClass( "green" );
			} else {
				$( ".studio" ).removeClass( "green" );
			}
			if (($scope.flatPrice * 0.2) < $scope.playerSavings) {
				$( ".flat" ).addClass( "green" );
			} else {
				$( ".flat" ).removeClass( "green" );
			}
			if (($scope.penthousePrice * 0.2) < $scope.playerSavings) {
				$( ".penthouse" ).addClass( "green" );
			} else {
				$( ".penthouse" ).removeClass( "green" );
			}
			if (($scope.villaPrice * 0.2) < $scope.playerSavings) {
				$( ".villa" ).addClass( "green" );
			} else {
				$( ".villa" ).removeClass( "green" );
			}
			if (($scope.blockPrice * 0.2) < $scope.playerSavings) {
				$( ".block" ).addClass( "green" );
			} else {
				$( ".block" ).removeClass( "green" );
			}
			if (($scope.towerPrice * 0.2) < $scope.playerSavings) {
				$( ".tower" ).addClass( "green" );
			} else {
				$( ".tower" ).removeClass( "green" );
			}
			if (($scope.complexPrice * 0.2) < $scope.playerSavings) {
				$( ".complex" ).addClass( "green" );
			} else {
				$( ".complex" ).removeClass( "green" );
			}
			if (($scope.urbanPrice * 0.2) < $scope.playerSavings) {
				$( ".urban" ).addClass( "green" );
			} else {
				$( ".urban" ).removeClass( "green" );
			}
		} else {
			$( ".studio" ).removeClass( "green" );
			$( ".flat" ).removeClass( "green" );
			$( ".penthouse" ).removeClass( "green" );
			$( ".villa" ).removeClass( "green" );
			$( ".block" ).removeClass( "green" );
			$( ".tower" ).removeClass( "green" );
			$( ".complex" ).removeClass( "green" );
			$( ".urban" ).removeClass( "green" );
		};
		
		// Run if the player owns properties
		if ($scope.properties.length != 0) {
			// Run through all properties
			for (i=0; i<$scope.properties.length; i++) {
				// Unconditional property data
				$scope.properties[i].marketPrice = Math.round($scope.properties[i].marketPrice + ($scope.properties[i].marketPrice * $scope.recession));
				$scope.totalPropertiesPrice+= $scope.properties[i].marketPrice;
				$scope.totalRent+= $scope.properties[i].rent;
				$scope.totalMonthlyMortgage+= $scope.properties[i].monthlyPayment;
				$scope.properties[i].devaluation +=1;
				$scope.properties[i].refurbish = Math.round($scope.properties[i].marketPrice * 0.2);

				// Adjust property devaluation after 15 years
				if ($scope.properties[i].devaluation > 179) {
					$scope.properties[i].totalPrice = Math.round($scope.properties[i].totalPrice + ($scope.properties[i].totalPrice * $scope.recession));
				} else {
					if ($scope.recessionStatus == "BOOM") {
						$scope.properties[i].totalPrice = Math.round($scope.properties[i].totalPrice + $scope.properties[i].totalPrice * ($scope.recession - ($scope.properties[i].devaluation / 450 * $scope.recession)));
					} else {
						$scope.properties[i].totalPrice = Math.round($scope.properties[i].totalPrice + $scope.properties[i].totalPrice * ($scope.recession + ($scope.properties[i].devaluation / 450 * $scope.recession)));
					};
					
				}
				
				// Adjust cancel mortgage price or keep it at 0
				if ($scope.properties[i].cancel > 0) {
					$scope.properties[i].cancel-= Math.round($scope.properties[i].monthlyPayment * 0.45);
				} else {
					$scope.properties[i].cancel = 0;
				}

				// Increase rent every year
				if ($scope.properties[i].devaluation%12 == 0) {
					$scope.properties[i].rent = Math.round($scope.properties[i].totalPrice / 165);
				}

				// Make sure player debt doesn't become negative. Add and deduct rent and mortgage from savings and debt
				if ($scope.playerDebt > 0) {
					$scope.properties[i].mortgage-= $scope.properties[i].monthlyPayment;
					$scope.playerSavings+= $scope.properties[i].rent;
					$scope.playerSavings-= $scope.properties[i].monthlyPayment;
					$scope.playerDebt-= $scope.properties[i].monthlyPayment;
				} else {
					$scope.playerDebt = 0;
					$scope.playerSavings+= $scope.properties[i].rent;
				}

				// Every 15 years the player can refurbish the property if he has enough savings
				if ($scope.properties[i].refurbish <= $scope.playerSavings && $scope.properties[i].devaluation > 179) {
					$scope.properties[i].colorRefurbish = "green";

					gameData.refurbish = function($index) {
						$scope.properties[$index].colorRefurbish = "none";
						$scope.playerSavings-= $scope.properties[$index].refurbish;
						$scope.properties[$index].devaluation = 0;
						$scope.properties[$index].totalPrice = $scope.properties[$index].marketPrice;
					};
				};

				// If there is a mortgage to pay and enough savings make the cancel button green
				if (($scope.properties[i].cancel <= $scope.playerSavings) && ($scope.properties[i].cancel > 0)) {
					$scope.properties[i].colorCancel = "green";
				} else {
					$scope.properties[i].colorCancel = "none";
				};

				// Cancel the mortgage
				gameData.cancel = function($index) {
					if ($scope.properties[$index].cancel <= $scope.playerSavings) {
						$scope.properties[$index].colorCancel = "none";
						$scope.playerSavings-= $scope.properties[$index].cancel;
						$scope.playerDebt-= $scope.properties[$index].mortgage;
						$scope.properties[$index].mortgage = 0;
						$scope.properties[$index].cancel = 0;
						$scope.properties[$index].monthlyPayment = 0;
					};
				};		

				// After one year of owning the property, the player can sell it
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

			setTimeout(propertyStatus, $scope.currentSpeed);
  	} 
	};

	// Set the game speed
	gameData.speed = function() {
		if ($scope.currentSpeed == 100) {
			$scope.currentSpeed = 1000;
		} else if ($scope.currentSpeed == 1000) {
			$scope.currentSpeed = 500;
		} else {
			$scope.currentSpeed = 100;
		}
	};

	// Set the economic cycle
	function boomRecession() {
		if (($scope.year % 100 <= 10) || (($scope.year % 100 < 25) && ($scope.year % 100 > 15)) || (($scope.year % 100 < 40) && ($scope.year % 100 > 30)) || (($scope.year % 100 < 55) && ($scope.year % 100 > 45)) || (($scope.year % 100 < 70) && ($scope.year % 100 > 60)) || (($scope.year % 100 < 85) && ($scope.year % 100 > 75)) || $scope.year % 100 > 90) {
			$scope.recession = 0.0035;
			$scope.recessionStatus = "BOOM";
		} else {
			$scope.recession = -0.0045;
			$scope.recessionStatus = "RECESSION";
		}
	}

	// Tweet your score
	function twitter() {
		window.twttr = (function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0],
		    t = window.twttr || {};
		  if (d.getElementById(id)) return t;
		  js = d.createElement(s);
		  js.id = id;
		  js.src = "https://platform.twitter.com/widgets.js";
		  fjs.parentNode.insertBefore(js, fjs);
		 
		  t._e = [];
		  t.ready = function(f) {
		    t._e.push(f);
		  };
		 
		  return t;
		}(document, "script", "twitter-wjs"));
	}

	// Restart the game
	gameData.restart = function() {
		startGameData();

		$('.howToPlay').show();
		$('.gamingData').show();		
		$( ".flat" ).removeClass( "green" );
		$( ".penthouse" ).removeClass( "green" );
		$( ".villa" ).removeClass( "green" );
		$( ".block" ).removeClass( "green" );
		$( ".tower" ).removeClass( "green" );
		$( ".complex" ).removeClass( "green" );
		$( ".urban" ).removeClass( "green" );
	}
}]);