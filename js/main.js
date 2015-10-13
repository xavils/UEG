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

		// Initial cities data
		$scope.cities = [];
		$scope.citiesList = ["Athens", "Barcelona", "Mumbai", "Sydney", "Paris", "New York", "London", "Hong Kong"];
		$scope.citiesPrice = [100000, 250000, 500000, 750000, 1000000, 2000000, 3000000, 5000000];

		for (i = 0; i < 8; i++) {
			$scope.cities.push({
				cityName: $scope.citiesList[i],
				units: 0,
				buyPrice: $scope.citiesPrice[i],
				buyPriceAbb: abbreviateNumber($scope.citiesPrice[i]),
				sellPrice: 0,
				sellPriceAbb: 0,
				cancel: 0,
				cancelAbb: "Mortgage Free",
				refurbish: 0,
				refurbishAbb: 0,
				devaluation: 0,
				colorBuy: "none",
				colorSell: "none",
				colorCancel: "none",
				colorRefurbish: "none",
				mortgage: 0,
				monthlyPayment: 0,
				rent: 0
			});
		}

		// Game initial settings
		$('.howToPlay').hide();
		$scope.howTo = "How to Play";
		$('.smallNet').hide();
		$('.gameOver').hide();
		$scope.totalPropertiesPrice = 0;
		$scope.recessionStatus = "BOOM";
		$scope.volume = "up";
		$scope.xSpeed = "1x";
		greenButton();
		$scope.currentSpeed = 1000;
	}

	// Buy 1 property actions
	gameData.buy = function($index) {
		

		// Gather city data from click
		$scope.moneyNeeded = $scope.cities[$index].buyPrice * 0.2;
		// Make sure player can actually buy
		if ($scope.moneyNeeded <= $scope.playerSavings) {
			// Update city data
			$scope.cities[$index].units+=1;
			$scope.cities[$index].sellPrice = (($scope.cities[$index].sellPrice * ($scope.cities[$index].units-1)) + $scope.cities[$index].buyPrice) / $scope.cities[$index].units;
			$scope.cities[$index].sellPriceAbb = abbreviateNumber($scope.cities[$index].sellPrice);
			$scope.cities[$index].cancel+= ($scope.cities[$index].buyPrice * 0.8);
			$scope.cities[$index].cancelAbb = "Cancel Debt $" + abbreviateNumber($scope.cities[$index].cancel);
			$scope.cities[$index].refurbish = $scope.cities[$index].buyPrice * $scope.cities[$index].units * 0.2;
			$scope.cities[$index].refurbishAbb = abbreviateNumber($scope.cities[$index].refurbish);
			$scope.cities[$index].devaluation = $scope.cities[$index].devaluation * ($scope.cities[$index].units-1) * $scope.cities[$index].units;
			$scope.cities[$index].mortgage+= ($scope.cities[$index].buyPrice * 0.8 * 1.2) + $scope.cities[$index].buyPrice * 0.8;
			$scope.cities[$index].monthlyPayment = $scope.cities[$index].mortgage / 480;
			$scope.cities[$index].rent = $scope.cities[$index].sellPrice * $scope.cities[$index].units / 165;

			// Update player data
			$scope.playerSavings-= $scope.cities[$index].buyPrice * 0.2;
			$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
			$scope.playerDebt+= ($scope.cities[$index].buyPrice * 0.8 * 1.2) + $scope.cities[$index].buyPrice * 0.8;
			$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);

			greenButton();
			// Start the game / time function
			if ($scope.year == 1999) {
				setTimeout(month, $scope.currentSpeed);
				setTimeout(propertyStatus, $scope.currentSpeed);
			}
		}
	};

	// Update calendar and general market price
	function month() {
		boomRecession();

		// Update cities market price
		$scope.$apply(function(){
			for (i = 0; i < 8; i++) {
				$scope.cities[i].buyPrice = $scope.cities[i].buyPrice + $scope.cities[i].buyPrice * $scope.recession;
				$scope.cities[i].buyPriceAbb = abbreviateNumber($scope.cities[i].buyPrice);
			}
		});

		// +1 Year
		if ($scope.counter%12 === 0) {
			$scope.year+= 1;
			$scope.counter = 0;
		}

		// Update date and apply savings interest
		$scope.$apply(function(){
			$scope.date = $scope.monthArray[$scope.counter] + " " + $scope.year;
			$scope.playerSavings+= $scope.playerSavings * 0.001;
			$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
			// The score
			$scope.netWorth = $scope.playerSavings - $scope.playerDebt + $scope.totalPropertiesPrice;
			negNetWorth($scope.netWorth);
		});

		// End the game
		if ($scope.year == 2100) {
			endGame();
			return;
		}

		$scope.counter +=1;
		setTimeout(month, $scope.currentSpeed);
	}

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

		// Run through all properties
		for (i=0; i<8; i++) {
			// Global property data
			$scope.totalPropertiesPrice+= $scope.cities[i].buyPrice * $scope.cities[i].units;
			$scope.totalRent+= $scope.cities[i].rent;
			$scope.totalRentAbb = abbreviateNumber($scope.totalRent);
			$scope.totalMonthlyMortgage+= $scope.cities[i].monthlyPayment;
			$scope.totalMonthlyMortgageAbb = abbreviateNumber($scope.totalMonthlyMortgage);

			// Devaluation data
			if ($scope.cities[i].units > 0) {
				$scope.cities[i].devaluation +=1;
			} else {
				$scope.cities[i].devaluation = 0;
			}

			// Refurbish Data
			$scope.cities[i].refurbish = $scope.cities[i].buyPrice * 0.2 * $scope.cities[i].units;
			$scope.cities[i].refurbishAbb = abbreviateNumber($scope.cities[i].refurbish);

			// Sell Price & adjust property devaluation after 15 years
			if ($scope.cities[i].devaluation > 179) {
				$scope.cities[i].sellPrice+= ($scope.cities[i].sellPrice * $scope.recession);
				$scope.cities[i].sellPriceAbb = abbreviateNumber($scope.cities[i].sellPrice);
			} else {
				if ($scope.recessionStatus == "BOOM") {
					$scope.cities[i].sellPrice = $scope.cities[i].sellPrice + $scope.cities[i].sellPrice * ($scope.recession - ($scope.cities[i].devaluation / 450 * $scope.recession));
					$scope.cities[i].sellPriceAbb = abbreviateNumber($scope.cities[i].sellPrice);
				} else {
					$scope.cities[i].sellPrice = $scope.cities[i].sellPrice + $scope.cities[i].sellPrice * ($scope.recession + ($scope.cities[i].devaluation / 450 * $scope.recession));
					$scope.cities[i].sellPriceAbb = abbreviateNumber($scope.cities[i].sellPrice);
				}				
			}
			
			// Adjust cancel mortgage price or keep it at 0
			if ($scope.cities[i].cancel > 0) {
				$scope.cities[i].cancel-= $scope.cities[i].monthlyPayment * 0.45;
				$scope.cities[i].cancelAbb = "Cancel Debt $" + abbreviateNumber($scope.cities[i].cancel);
			} else {
				$scope.cities[i].cancel = 0;
				$scope.cities[i].cancelAbb = "Mortgage Free";
			}

			// Increase rent every year
			if ($scope.cities[i].devaluation%12 === 0) {
				$scope.cities[i].rent = $scope.cities[i].sellPrice / 165 * $scope.cities[i].units;
			}

			// Make sure player debt doesn't become negative. Add and deduct rent and mortgage from savings and debt
			if ($scope.playerDebt > 0) {
				$scope.cities[i].mortgage-= $scope.cities[i].monthlyPayment;
				$scope.playerSavings+= $scope.cities[i].rent;
				$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
				$scope.playerSavings-= $scope.cities[i].monthlyPayment;
				$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
				$scope.playerDebt-= $scope.cities[i].monthlyPayment;
				$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
			} else {
				$scope.playerDebt = 0;
				$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
				$scope.playerSavings+= $scope.cities[i].rent;
				$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
			}

			if ($scope.cities[i].units > 0) {			
				// Every 15 years the player can refurbish the property if he has enough savings
				if ($scope.cities[i].refurbish <= $scope.playerSavings && $scope.cities[i].devaluation > 179) {
					gameData.refurbish = function($index) {
						$scope.cities[$index].colorRefurbish = "none";
						$scope.playerSavings-= $scope.cities[$index].refurbish;
						$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
						$scope.cities[$index].devaluation = 0;
						$scope.cities[$index].sellPrice = $scope.cities[$index].buyPrice;
						$scope.cities[$index].sellPriceAbb = abbreviateNumber($scope.cities[$index].sellPrice);
					};
				}

				// Cancel the mortgage
				gameData.cancel = function($index) {
					if ($scope.cities[$index].cancel <= $scope.playerSavings) {
						$scope.cities[$index].colorCancel = "none";
						$scope.playerSavings-= $scope.cities[$index].cancel;
						$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
						$scope.playerDebt-= $scope.cities[$index].mortgage;
						$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
						$scope.cities[$index].mortgage = 0;
						$scope.cities[$index].cancel = 0;
						$scope.cities[$index].cancelAbb = "Mortgage Free";
						$scope.cities[$index].monthlyPayment = 0;
					}
				}	

				// Sell 1 property from 1 city
				gameData.sell = function($index) {
					if ($scope.cities[$index].devaluation >= 12) {
						$scope.playerSavings+= $scope.cities[$index].sellPrice - ($scope.cities[$index].cancel / $scope.cities[$index].units);
						$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
						$scope.playerDebt-= $scope.cities[$index].mortgage / $scope.cities[$index].units;
						$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
						$scope.cities[$index].units-=1;

						if ($scope.cities[$index].units == 0) {
							$scope.cities[$index].sellPrice = 0;
							$scope.cities[$index].sellPriceAbb = abbreviateNumber($scope.cities[$index].sellPrice);
							$scope.cities[$index].cancel = 0;
							$scope.cities[$index].cancelAbb = "Mortgage Free"
						}
					}
				};				
			}
		}

		greenButton();
		setTimeout(propertyStatus, $scope.currentSpeed);
	}

	// Set the game speed
	gameData.speed = function() {
		if ($scope.currentSpeed == 200) {
			$scope.currentSpeed = 1000;
			$scope.xSpeed = "1x";
		} else if ($scope.currentSpeed == 1000) {
			$scope.currentSpeed = 500;
			$scope.xSpeed = "2x";
		} else {
			$scope.currentSpeed = 200;
			$scope.xSpeed = "5x";
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
		$('.propertyList').show(500);		
	};

	// Abbreviate Numbers
	function abbreviateNumber(value) {
    var newValue = Math.round(value);
    var suffixes = ["", "K", "M", "B","T"];
    var divide = [1, 1000, 1000000, 1000000000, 1000000000000];
    
    if ((""+value).length <= 4) {
    	return newValue;
	  } else {
	  	if (value >= 0) {
	  		var suffixNum = Math.floor(((""+Math.round(value)).length - 1)/3);
	  	} else {
	  		var suffixNum = Math.floor(((""+Math.round(value)).length - 2)/3);
	  	}
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

	// how to play show/hide
	gameData.howToPlay = function() {
		if ($scope.howTo == "How to Play") {
			$scope.howTo = "Back to game";
			$('.propertyList').hide(500);
			$('.howToPlay').show(500);
		} else {
			$scope.howTo = "How to Play";
			$('.howToPlay').hide(500);
			$('.propertyList').show(500);
		}
	}

	// Show more/less game data
	gameData.moreInfo = function() {
		$('.largeNet').toggle(500);
		$('.smallNet').toggle(500);
	}

	// Volume control
	gameData.volumeControl = function() {
		if ($scope.volume == "up") {
			console.log("test");
			$scope.volume = "off";
			document.getElementById("testLoop").pause();
		} else {
			$scope.volume = "up"
			document.getElementById("testLoop").play();
		}
	}
	// green buttons
	function greenButton() {
		for (i=0; i<8; i++) {
			// Buy green button
			if (($scope.cities[i].buyPrice * 0.2) < $scope.playerSavings) {
				$scope.cities[i].colorBuy = "green";
			} else {
				$scope.cities[i].colorBuy = "none";
			}

			// If there is a mortgage to pay and enough savings make the cancel button green
			if (($scope.cities[i].cancel <= $scope.playerSavings) && ($scope.cities[i].cancel > 0)) {
				$scope.cities[i].colorCancel = "green";
			} else {
				$scope.cities[i].colorCancel = "none";
			}

			// After one year of owning the property, the player can sell it
			if ($scope.cities[i].devaluation >= 12) {
				$scope.cities[i].colorSell = "green";
			} else {
				$scope.cities[i].colorSell = "none";
			}

			// Rerfurbish possible after 15 years of average ownership
			if ($scope.cities[i].refurbish <= $scope.playerSavings && $scope.cities[i].devaluation > 179) {
				$scope.cities[i].colorRefurbish = "green";
			} else {
				$scope.cities[i].colorRefurbish = "none";
			}
		}
	}

	// end the game
	function endGame() {
		$('.propertyList').hide(500);
		$('.gameOver').show(500);

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
	}
}]);