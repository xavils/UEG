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
		$scope.athensPrice = 100000;
		$scope.athensPriceAbb = abbreviateNumber($scope.athensPrice);
		$scope.barcelonaPrice = 250000;
		$scope.barcelonaPriceAbb = abbreviateNumber($scope.barcelonaPrice);
		$scope.mumbaiPrice = 500000;
		$scope.mumbaiPriceAbb = abbreviateNumber($scope.mumbaiPrice);
		$scope.sydneyPrice = 750000;
		$scope.sydneyPriceAbb = abbreviateNumber($scope.sydneyPrice);
		$scope.parisPrice = 1000000;
		$scope.parisPriceAbb = abbreviateNumber($scope.parisPrice);
		$scope.newYorkPrice = 2000000;
		$scope.newYorkPriceAbb = abbreviateNumber($scope.newYorkPrice);
		$scope.londonPrice = 3000000;
		$scope.londonPriceAbb = abbreviateNumber($scope.londonPrice);
		$scope.hongKongPrice = 5000000;
		$scope.hongKongPriceAbb = abbreviateNumber($scope.hongKongPrice);

		$scope.athens = "ATHENS";
		$scope.barcelona = "BARCELONA";
		$scope.mumbai = "MUMBAI";
		$scope.sydney = "SYDNEY";
		$scope.paris = "PARIS";
		$scope.newYork = "NEW YORK";
		$scope.london = "LONDON";
		$scope.hongKong = "HONG KONG";
		
		// Player initial data
		$scope.playerSavings = 38000;
		$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
		$scope.playerDebt = 0;
		$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
		$scope.netWorth = $scope.playerSavings - $scope.playerDebt;
		negNetWorth($scope.netWorth);
		$scope.totalRent = 0;
		$scope.totalRentAbb = abbreviateNumber($scope.totalRent);
		$scope.totalMonthlyMortgage = 0;
		$scope.totalMonthlyMortgageAbb = abbreviateNumber($scope.totalMonthlyMortgage);
		$scope.properties = [];

		// Game initial settings
		$('.propertyList').hide();
		$('.gameOver').hide();
		$('.yUNo').hide();
		$scope.currentSpeed = 100;
	}

	// Buy 1 property actions
	gameData.buy = function(propertyType, stringType) {
		// Gather propertyType data from click
		$scope.generalTotalPrice = propertyType;
		$scope.moneyNeeded = Math.round($scope.generalTotalPrice * 0.2);
		$scope.typeString = stringType;

		// Make sure player can actually buy
		if (($scope.moneyNeeded <= $scope.playerSavings) && ($scope.properties.length < 15)) {
			$('.yUNo').hide();
			$('.propertyList').show();

			// Add new property to properties[]
			$scope.properties.push({
				propertyIs: $scope.typeString,
				totalPrice: $scope.generalTotalPrice,
				totalPriceAbb: abbreviateNumber($scope.generalTotalPrice),
				marketPrice: $scope.generalTotalPrice,
				mortgage: Math.round(($scope.generalTotalPrice * 0.8 * 1.2) + $scope.generalTotalPrice * 0.8),
				monthlyPayment: Math.round((($scope.generalTotalPrice * 0.8 * 1.2) + $scope.generalTotalPrice * 0.8) / 480),
				rent: Math.round($scope.generalTotalPrice / 165),
				cancel: Math.round($scope.generalTotalPrice * 0.8),
				cancelAbb: "$" + abbreviateNumber(Math.round($scope.generalTotalPrice * 0.8)),
				refurbish: Math.round($scope.generalTotalPrice * 0.2),
				refurbishAbb: abbreviateNumber(Math.round($scope.generalTotalPrice * 0.2)),
				devaluation: 0,
				colorSell: "none",
				colorCancel: "none",
				colorRefurbish: "none"
			})

			// Update player data
			$scope.playerSavings-= Math.round($scope.generalTotalPrice * 0.2);
			$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
			$scope.playerDebt+= Math.round(($scope.generalTotalPrice * 0.8 * 1.2) + $scope.generalTotalPrice * 0.8);
			$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);

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
			$scope.athensPrice = Math.round($scope.athensPrice + $scope.athensPrice * $scope.recession);
			$scope.athensPriceAbb = abbreviateNumber($scope.athensPrice)
			$scope.barcelonaPrice = Math.round($scope.barcelonaPrice + $scope.barcelonaPrice * $scope.recession);
			$scope.barcelonaPriceAbb = abbreviateNumber($scope.barcelonaPrice);
			$scope.mumbaiPrice = Math.round($scope.mumbaiPrice + $scope.mumbaiPrice * $scope.recession);
			$scope.mumbaiPriceAbb = abbreviateNumber($scope.mumbaiPrice);
			$scope.sydneyPrice = Math.round($scope.sydneyPrice + $scope.sydneyPrice * $scope.recession);
			$scope.sydneyPriceAbb = abbreviateNumber($scope.sydneyPrice);
			$scope.parisPrice = Math.round($scope.parisPrice + $scope.parisPrice * $scope.recession);
			$scope.parisPriceAbb = abbreviateNumber($scope.parisPrice);
			$scope.newYorkPrice = Math.round($scope.newYorkPrice + $scope.newYorkPrice * $scope.recession);
			$scope.newYorkPriceAbb = abbreviateNumber($scope.newYorkPrice);
			$scope.londonPrice = Math.round($scope.londonPrice + $scope.londonPrice * $scope.recession);
			$scope.londonPriceAbb = abbreviateNumber($scope.londonPrice);
			$scope.hongKongPrice = Math.round($scope.hongKongPrice + $scope.hongKongPrice * $scope.recession);
			$scope.hongKongPriceAbb = abbreviateNumber($scope.hongKongPrice);
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
			$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
			// The score
			$scope.netWorth = $scope.playerSavings - $scope.playerDebt + $scope.totalPropertiesPrice;
			negNetWorth($scope.netWorth);
		});


		if ($scope.properties.length == 0) {
			$('.propertyList').hide();
			$('.yUNo').show();
		}

		// End the game
		if ($scope.year == 2100) {
			$('.propertyList').hide();
			$('.gamingData').hide();
			$('.yUNo').hide();
			$('.gameOver').show();

			$scope.$apply(function(){
				// Game over message
				if ($scope.netWorth > 1000000000) {
					$scope.gameOver = "Congrats. You are richer than Donald Trump!";
				} else if (0 > $scope.netWorth) {
					$scope.gameOver = "Game Over! You owe a shit-ton of money to the evil banks!";
				}	else if (0 <= $scope.netWorth < 1000000) {
					$scope.gameOver = "Game Over! You really tried your best to stay poor(ish).";
				} else {
					$scope.gameOver = "Game Over! You are dead and failed to become filthy rich.";
				}

				// Store highscore
				if ($scope.netWorth > Number(localStorage.highScore) || typeof localStorage.highScore === 'undefined') {
		    	localStorage.highScore = $scope.netWorth;
		    	$scope.highScore = localStorage.getItem("highScore");
		    	$scope.highScoreAbb = abbreviateNumber($scope.highScore);
		    } else {
		    	$scope.highScore = localStorage.getItem("highScore");
		    	$scope.highScoreAbb = abbreviateNumber($scope.highScore);
		    }
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
		$scope.totalRentAbb = abbreviateNumber($scope.totalRent);
		$scope.totalMonthlyMortgage = 0;
		$scope.totalMonthlyMortgageAbb = abbreviateNumber($scope.totalMonthlyMortgage);

		// Manage button color
		if ($scope.properties.length < 15) {
			if (($scope.athensPrice * 0.2) < $scope.playerSavings) {
				$( ".athens" ).addClass( "green" );
			} else {
				$( ".athens" ).removeClass( "green" );
			}
			if (($scope.barcelonaPrice * 0.2) < $scope.playerSavings) {
				$( ".barcelona" ).addClass( "green" );
			} else {
				$( ".barcelona" ).removeClass( "green" );
			}
			if (($scope.mumbaiPrice * 0.2) < $scope.playerSavings) {
				$( ".mumbai" ).addClass( "green" );
			} else {
				$( ".mumbai" ).removeClass( "green" );
			}
			if (($scope.sydneyPrice * 0.2) < $scope.playerSavings) {
				$( ".sydney" ).addClass( "green" );
			} else {
				$( ".sydney" ).removeClass( "green" );
			}
			if (($scope.parisPrice * 0.2) < $scope.playerSavings) {
				$( ".paris" ).addClass( "green" );
			} else {
				$( ".paris" ).removeClass( "green" );
			}
			if (($scope.newYorkPrice * 0.2) < $scope.playerSavings) {
				$( ".newYork" ).addClass( "green" );
			} else {
				$( ".newYork" ).removeClass( "green" );
			}
			if (($scope.londonPrice * 0.2) < $scope.playerSavings) {
				$( ".london" ).addClass( "green" );
			} else {
				$( ".london" ).removeClass( "green" );
			}
			if (($scope.hongKongPrice * 0.2) < $scope.playerSavings) {
				$( ".hongKong" ).addClass( "green" );
			} else {
				$( ".hongKong" ).removeClass( "green" );
			}
		} else {
			$( ".athens" ).removeClass( "green" );
			$( ".barcelona" ).removeClass( "green" );
			$( ".mumbai" ).removeClass( "green" );
			$( ".sydney" ).removeClass( "green" );
			$( ".paris" ).removeClass( "green" );
			$( ".newYork" ).removeClass( "green" );
			$( ".london" ).removeClass( "green" );
			$( ".hongKong" ).removeClass( "green" );
		};
		
		// Run if the player owns properties
		if ($scope.properties.length != 0) {
			// Run through all properties
			for (i=0; i<$scope.properties.length; i++) {
				// Unconditional property data
				$scope.properties[i].marketPrice = Math.round($scope.properties[i].marketPrice + ($scope.properties[i].marketPrice * $scope.recession));
				$scope.totalPropertiesPrice+= $scope.properties[i].marketPrice;
				$scope.totalRent+= $scope.properties[i].rent;
				$scope.totalRentAbb = abbreviateNumber($scope.totalRent);
				$scope.totalMonthlyMortgage+= $scope.properties[i].monthlyPayment;
				$scope.totalMonthlyMortgageAbb = abbreviateNumber($scope.totalMonthlyMortgage);
				$scope.properties[i].devaluation +=1;
				$scope.properties[i].refurbish = Math.round($scope.properties[i].marketPrice * 0.2);
				$scope.properties[i].refurbishAbb = abbreviateNumber($scope.properties[i].refurbish);

				// Adjust property devaluation after 15 years
				if ($scope.properties[i].devaluation > 179) {
					$scope.properties[i].totalPrice = Math.round($scope.properties[i].totalPrice + ($scope.properties[i].totalPrice * $scope.recession));
					$scope.properties[i].totalPriceAbb = abbreviateNumber($scope.properties[i].totalPrice);
				} else {
					if ($scope.recessionStatus == "BOOM") {
						$scope.properties[i].totalPrice = Math.round($scope.properties[i].totalPrice + $scope.properties[i].totalPrice * ($scope.recession - ($scope.properties[i].devaluation / 450 * $scope.recession)));
						$scope.properties[i].totalPriceAbb = abbreviateNumber($scope.properties[i].totalPrice);
					} else {
						$scope.properties[i].totalPrice = Math.round($scope.properties[i].totalPrice + $scope.properties[i].totalPrice * ($scope.recession + ($scope.properties[i].devaluation / 450 * $scope.recession)));
						$scope.properties[i].totalPriceAbb = abbreviateNumber($scope.properties[i].totalPrice);
					};
					
				}
				
				// Adjust cancel mortgage price or keep it at 0
				if ($scope.properties[i].cancel > 0) {
					$scope.properties[i].cancel-= Math.round($scope.properties[i].monthlyPayment * 0.45);
					$scope.properties[i].cancelAbb = "$" + abbreviateNumber($scope.properties[i].cancel);
				} else {
					$scope.properties[i].cancel = 0;
					$scope.properties[i].cancelAbb = "Mortgage Free";
				}

				// Increase rent every year
				if ($scope.properties[i].devaluation%12 == 0) {
					$scope.properties[i].rent = Math.round($scope.properties[i].totalPrice / 165);
				}

				// Make sure player debt doesn't become negative. Add and deduct rent and mortgage from savings and debt
				if ($scope.playerDebt > 0) {
					$scope.properties[i].mortgage-= $scope.properties[i].monthlyPayment;
					$scope.playerSavings+= $scope.properties[i].rent;
					$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
					$scope.playerSavings-= $scope.properties[i].monthlyPayment;
					$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
					$scope.playerDebt-= $scope.properties[i].monthlyPayment;
					$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
				} else {
					$scope.playerDebt = 0;
					$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
					$scope.playerSavings+= $scope.properties[i].rent;
					$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
				}

				// Every 15 years the player can refurbish the property if he has enough savings
				if ($scope.properties[i].refurbish <= $scope.playerSavings && $scope.properties[i].devaluation > 179) {
					$scope.properties[i].colorRefurbish = "green";

					gameData.refurbish = function($index) {
						$scope.properties[$index].colorRefurbish = "none";
						$scope.playerSavings-= $scope.properties[$index].refurbish;
						$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
						$scope.properties[$index].devaluation = 0;
						$scope.properties[$index].totalPrice = $scope.properties[$index].marketPrice;
						$scope.properties[$index].totalPriceAbb = abbreviateNumber($scope.properties[$index].totalPrice);
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
						$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
						$scope.playerDebt-= $scope.properties[$index].mortgage;
						$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
						$scope.properties[$index].mortgage = 0;
						$scope.properties[$index].cancel = 0;
						$scope.properties[$index].cancelAbb = "Mortgage Free"
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
						$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
						$scope.playerDebt-= $scope.properties[$index].mortgage;
						$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
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

	// Restart the game
	gameData.restart = function() {
		startGameData();

		$('.howToPlay').show();
		$('.gamingData').show();		
		$( ".barcelona" ).removeClass( "green" );
		$( ".mumbai" ).removeClass( "green" );
		$( ".sydney" ).removeClass( "green" );
		$( ".paris" ).removeClass( "green" );
		$( ".newYork" ).removeClass( "green" );
		$( ".london" ).removeClass( "green" );
		$( ".hongKong" ).removeClass( "green" );
	}

	// Abbreviate Numbers
	function abbreviateNumber(value) {
    var newValue = value;
    var suffixes = ["", "K", "M", "B","T"];
    var divide = [1, 1000, 1000000, 1000000000, 1000000000000];
    
    if ((""+value).length <= 4) {
    	return newValue;
	  } else {
	  	var suffixNum = Math.floor(((""+value).length - 1)/3);
	  	var shortValue = (value/divide[suffixNum]).toPrecision(3);
	  	newValue = "" + shortValue + suffixes[suffixNum];
	  	return newValue;
	  }
	}

	// Fix negative netWorth
	function negNetWorth(netW) {
		if (netW >= 0) {
				$scope.netWorthAbb = "$" + abbreviateNumber(netW);
			} else {
				$scope.netWorthAbb = "-$" + abbreviateNumber(netW).substring(1);
			}
	}
}]);