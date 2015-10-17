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
		$scope.netWorth = $scope.playerSavings;
		negNetWorth($scope.netWorth);
		$scope.totalRent = 0;
		$scope.totalRentAbb = abbreviateNumber($scope.totalRent);
		$scope.totalMonthlyMortgage = 0;
		$scope.totalMonthlyMortgageAbb = abbreviateNumber($scope.totalMonthlyMortgage);

		// Initial cities data
		$scope.cities = [];
		$scope.citiesList = ["Athens", "Barcelona", "Mumbai", "Sydney", "Paris", "New York", "London", "Hong Kong"];
		$scope.citiesPrice = [100000, 250000, 500000, 750000, 1000000, 2000000, 3000000, 5000000];
		$scope.citiesImages = ["img/athens.png", "img/barcelona.png", "img/mumbai.png", "img/sydney.png", "img/paris.png", "img/newYork.png", "img/london.png", "img/hongKong.png"]

		for (i = 0; i < 8; i++) {
			$scope.cities.push({
				cityName: $scope.citiesList[i],
				img: $scope.citiesImages[i],
				units: 0,
				buyPrice: $scope.citiesPrice[i],
				buyPriceAbb: abbreviateNumber($scope.citiesPrice[i]),
				sellPrice: 0,
				sellPriceAbb: "Buy More, Buy More!",
				cancel: 0,
				cancelAbb: "Mortgage Free",
				refurbish: 0,
				refurbishAbb: "Nothing to repair",
				devaluation: 0,
				sellCounter: 0,
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
		$('.smallNet').hide();
		$('.gameOver').hide();
		$('.hideEnd').show();
		$('#chaChing').show();
		$scope.howTo = "How to Play";
		$scope.totalPropertiesPrice = 0;
		$scope.recessionStatus = "BOOM";
		$scope.volume = "up";
		$scope.xSpeed = "1x";
		$scope.currentSpeed = 500;
		greenButton();
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
			$scope.cities[$index].sellPriceAbb = "Sell $" + abbreviateNumber($scope.cities[$index].sellPrice);
			$scope.cities[$index].cancel+= ($scope.cities[$index].buyPrice * 0.8);
			$scope.cities[$index].cancelAbb = "Cancel Debt $" + abbreviateNumber($scope.cities[$index].cancel);
			$scope.cities[$index].refurbish = $scope.cities[$index].buyPrice * $scope.cities[$index].units * 0.1;
			$scope.cities[$index].refurbishAbb = "Good condition";
			$scope.cities[$index].devaluation = $scope.cities[$index].devaluation * ($scope.cities[$index].units-1) / $scope.cities[$index].units;
			$scope.cities[$index].sellCounter = 0;
			$scope.cities[$index].mortgage = ($scope.cities[$index].buyPrice * 0.8 * 1.2) + $scope.cities[$index].buyPrice * 0.8;
			$scope.cities[$index].monthlyPayment+= $scope.cities[$index].mortgage / 480;
			$scope.cities[$index].rent = $scope.cities[$index].sellPrice * $scope.cities[$index].units / 165;

			// Update player data
			$scope.playerSavings-= $scope.cities[$index].buyPrice * 0.2;
			$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
			$scope.playerDebt+= Math.round($scope.cities[$index].mortgage);
			$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
			$scope.totalPropertiesPrice+= $scope.cities[$index].sellPrice / $scope.cities[$index].units;

			chaChing();
			greenButton();
			updateNetWorth();

			// add to total mortgage
			$scope.totalMonthlyMortgage+= $scope.cities[$index].mortgage / 480;
			$scope.totalMonthlyMortgageAbb = abbreviateNumber($scope.totalMonthlyMortgage);

			// Start the game / time function
			if ($scope.year == 1999) {
				setTimeout(month, $scope.currentSpeed);
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
			$scope.playerSavings+= $scope.totalRent - $scope.totalMonthlyMortgage;
			$scope.playerSavings+= $scope.playerSavings * 0.001;
			$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);

			// The score
			updateNetWorth();
		});

		// End the game
		if ($scope.year == 2100) {
			endGame();
			return;
		}

		// Refresh monthly data
		$scope.totalPropertiesPrice = 0;
		$scope.rentSum = 0;

		// Run through all properties
		for (i=0; i<8; i++) {
			// Global property data
			$scope.totalPropertiesPrice+= $scope.cities[i].sellPrice * $scope.cities[i].units;
			$scope.rentSum+= $scope.cities[i].rent;

			// Devaluation and sell data
			if ($scope.cities[i].units > 0) {
				$scope.cities[i].devaluation+=1;
				$scope.cities[i].sellCounter+=1;
				// Sell Price & adjust property devaluation after 15 years
				if ($scope.cities[i].devaluation > 179) {
					$scope.cities[i].sellPrice+= ($scope.cities[i].sellPrice * $scope.recession);
					$scope.cities[i].sellPriceAbb = "Sell $" + abbreviateNumber($scope.cities[i].sellPrice);
				} else {
					if ($scope.recessionStatus == "BOOM") {
						$scope.cities[i].sellPrice = $scope.cities[i].sellPrice + $scope.cities[i].sellPrice * ($scope.recession - ($scope.cities[i].devaluation / 450 * $scope.recession));
						$scope.cities[i].sellPriceAbb = "Sell $" + abbreviateNumber($scope.cities[i].sellPrice);
					} else {
						$scope.cities[i].sellPrice = $scope.cities[i].sellPrice + $scope.cities[i].sellPrice * ($scope.recession + ($scope.cities[i].devaluation / 450 * $scope.recession));
						$scope.cities[i].sellPriceAbb = "Sell $" + abbreviateNumber($scope.cities[i].sellPrice);
					}				
				}
			} else {
				$scope.cities[i].devaluation = 0;
				$scope.cities[i].sellCounter = 0;
				$scope.cities[i].sellPriceAbb = "Buy more, Buy more!";
			}

			// Refurbish Data
			$scope.cities[i].refurbish = $scope.cities[i].buyPrice * 0.1 * $scope.cities[i].units;
			if ($scope.cities[i].devaluation <= 179) {
				$scope.cities[i].refurbishAbb = "Good condition";
			} else if ($scope.cities[i].devaluation > 179 && $scope.playerSavings >= $scope.cities[i].refurbish) {
				$scope.cities[i].refurbishAbb = "Refurbish $" + abbreviateNumber($scope.cities[i].refurbish);
			} else {
				$scope.cities[i].refurbishAbb = "Can't afford repair";
			}
			
			// Adjust cancel mortgage price or keep it at 0
			if ($scope.cities[i].cancel > 0) {
				$scope.cities[i].cancel-= $scope.cities[i].monthlyPayment * 0.45;
				$scope.cities[i].cancelAbb = "Cancel Debt $" + abbreviateNumber($scope.cities[i].cancel);
			} else {
				$scope.cities[i].cancel = 0;
				$scope.cities[i].cancelAbb = "Mortgage Free";
				$scope.cities[i].monthlyPayment = 0;
			}

			// Increase rent every year
			if ($scope.counter%12 === 0) {
				$scope.cities[i].rent = $scope.cities[i].sellPrice / 165 * $scope.cities[i].units;
			}

			// Make sure player debt doesn't become negative. Add and deduct rent and mortgage from savings and debt
			if ($scope.playerDebt > 0) {
				$scope.playerDebt-= Math.round($scope.cities[i].monthlyPayment);
				$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
			} else {
				$scope.playerDebt = 0;
				$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
			}

			debtAdjust();
		}

		// Monthly general data
		$scope.totalRent = $scope.rentSum;
		$scope.totalRentAbb = abbreviateNumber($scope.totalRent);

		greenButton();
		$scope.counter +=1;
		setTimeout(month, $scope.currentSpeed);
	}

	// Every 15 years the player can refurbish the property if he has enough savings
	gameData.refurbish = function($index) {
		if ($scope.cities[$index].refurbish <= $scope.playerSavings && $scope.cities[$index].devaluation > 179 && $scope.cities[$index].units > 0) {
			$scope.cities[$index].colorRefurbish = "none";
			$scope.playerSavings-= $scope.cities[$index].refurbish;
			$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
			$scope.cities[$index].devaluation = 0;
			$scope.cities[$index].sellPrice = $scope.cities[$index].buyPrice;
			$scope.cities[$index].sellPriceAbb = "Sell $" + abbreviateNumber($scope.cities[$index].sellPrice);

			chaChing();
			greenButton();
		}
	};

	// Cancel the mortgage
	gameData.cancel = function($index) {
		if ($scope.cities[$index].cancel <= $scope.playerSavings && $scope.cities[$index].units > 0) {
			$scope.cities[$index].colorCancel = "none";
			$scope.playerSavings-= $scope.cities[$index].cancel;
			$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
			$scope.playerDebt-= Math.round($scope.cities[$index].cancel * 2.22);
			$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
			$scope.cities[$index].mortgage = 0;
			$scope.cities[$index].cancel = 0;
			$scope.cities[$index].cancelAbb = "Mortgage Free";
			$scope.totalMonthlyMortgage-= $scope.cities[$index].monthlyPayment;
			$scope.totalMonthlyMortgageAbb = abbreviateNumber($scope.totalMonthlyMortgage);
			$scope.cities[$index].monthlyPayment = 0;

			chaChing();
			debtAdjust();
			greenButton();
		}
	};	

	// Sell 1 property from 1 city
	gameData.sell = function($index) {
		if ($scope.cities[$index].sellCounter >= 12 && $scope.cities[$index].units > 0) {
			$scope.playerSavings+= $scope.cities[$index].sellPrice - ($scope.cities[$index].cancel / $scope.cities[$index].units);
			$scope.playerSavingsAbb = abbreviateNumber($scope.playerSavings);
			$scope.playerDebt-= Math.round($scope.cities[$index].cancel * 2.22 / $scope.cities[$index].units);
			$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
			$scope.cities[$index].cancel-= $scope.cities[$index].cancel / $scope.cities[$index].units;
			$scope.cities[$index].cancelAbb = "Cancel Debt $" + abbreviateNumber($scope.cities[$index].cancel);
			$scope.totalMonthlyMortgage-= Math.round($scope.cities[$index].monthlyPayment / $scope.cities[$index].units);
			$scope.totalMonthlyMortgageAbb = abbreviateNumber($scope.totalMonthlyMortgage);
			$scope.cities[$index].monthlyPayment-= $scope.cities[$index].monthlyPayment / $scope.cities[$index].units;
			$scope.totalPropertiesPrice-= $scope.cities[$index].sellPrice / $scope.cities[$index].units;
			$scope.rentSum-= ($scope.cities[$index].sellPrice / $scope.cities[$index].units) / 165;
			$scope.cities[$index].units-=1;
			$scope.cities[$index].rent = $scope.cities[$index].sellPrice * $scope.cities[$index].units / 165;

			if ($scope.cities[$index].units === 0) {
				$scope.cities[$index].sellPrice = 0;
				$scope.cities[$index].sellPriceAbb = "Buy More, Buy More!";
				$scope.cities[$index].refurbishAbb = "Nothing to repair";
				$scope.cities[$index].cancel = 0;
				$scope.cities[$index].cancelAbb = "Mortgage Free";
				$scope.totalRent = 0;
				$scope.totalRentAbb = abbreviateNumber($scope.totalRent);
			} else {
				$scope.totalRent = $scope.rentSum;
				$scope.totalRentAbb = abbreviateNumber($scope.totalRent);
			}
			
			if ($scope.totalMonthlyMortgage < 350){
				$scope.totalMonthlyMortgage = 0;
				$scope.totalMonthlyMortgageAbb = abbreviateNumber($scope.totalMonthlyMortgage);
			}

			updateNetWorth();
			chaChing();
			debtAdjust();
			greenButton();
		}
	};

	// Debt adjust
	function debtAdjust() {
		if ($scope.totalMonthlyMortgage == 0) {
			$scope.playerDebt = 0;
			$scope.playerDebtAbb = abbreviateNumber($scope.playerDebt);
		}
	}
	// Set the game speed
	gameData.speed = function() {
		if ($scope.currentSpeed == 100) {
			$scope.currentSpeed = 500;
			$scope.xSpeed = "1x";
		} else if ($scope.currentSpeed == 500) {
			$scope.currentSpeed = 250;
			$scope.xSpeed = "2x";
		} else {
			$scope.currentSpeed = 100;
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
		$('.netWorthRow').show(500);		
	};

	// Abbreviate Numbers
	function abbreviateNumber(value) {
	    var newValue = Math.round(value);
	    var suffixes = ["", "K", "M", "B","T"];
	    var divide = [1, 1000, 1000000, 1000000000, 1000000000000];
	    
	    if ((""+Math.round(value)).length <= 4) {
	    	newValue = Math.round(value).toPrecision(4);
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

	// update net netWorth
	function updateNetWorth() {
		$scope.netWorth = $scope.playerSavings - $scope.playerDebt + $scope.totalPropertiesPrice;
		negNetWorth($scope.netWorth);
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
	};

	// Show more/less game data
	gameData.moreInfo = function() {
		$('.largeNet').toggle(500);
		$('.smallNet').toggle(500);
	};

	// Volume control
	gameData.volumeControl = function() {
		if ($scope.volume == "up") {
			$scope.volume = "off";
			document.getElementById("testLoop").pause();
		} else {
			$scope.volume = "up";
			document.getElementById("testLoop").play();
		}
	};
	function chaChing() {
		if ($scope.volume == "up") {
			document.getElementById("chaChing").play();
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
			if ($scope.cities[i].sellCounter >= 12 && $scope.cities[i].units > 0) {
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
		$('.hideEnd').hide(500);
		$('.smallNet').hide(500);
		$('.largeNet').show(500);
		$('.gameOver').show(500);
		document.getElementById("testLoop").pause();

		$scope.$apply(function(){
			// Game over message
			if ($scope.netWorth > 1000000000) {
				$scope.gameOver = "Good Job! You are richer than Donald Trump!";
			} else if (0 > $scope.netWorth) {
				$scope.gameOver = "Game Over! You owe a shit-ton of money to the evil banks!";
			}	else if (0 <= $scope.netWorth < 1000000) {
				$scope.gameOver = "Game Over! You really tried your best to stay poor(ish).";
			} else if (1000000 <= $scope.netWorth < 100000000) {
				$scope.gameOver = "Game Over! You are dead and failed to become filthy rich.";
			} else {
				$scope.gameOver = "Good Job! But, who wants to be a millionare if you can become a billionare, right?";
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