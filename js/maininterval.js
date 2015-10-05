angular.module('game', [])
  
.controller('gameController', function() {
	var gameData = this;

	// Calendar
	var counter = 0;
	var year = 1999;
	var currentMonth = "December";
	var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	gameData.date = currentMonth + " " + year;

	// Studio initial data
	var studio = {};
	studio.totalPrice = 100000;
	studio.moneyNeeded = Math.round(studio.totalPrice * 0.2);
	
	// Player initial data
	var player = {};
	player.savings = 38000;
	player.debt = 0;
	gameData.playerSavings = player.savings;
	gameData.playerDebt = player.debt;

	// Player properties
	gameData.properties = [];
	// var property ={}	

	// property.totalPrice = studio.totalPrice;
	// property.mortgage = Math.round((studio.totalPrice * 0.8 * 1.2) + studio.totalPrice * 0.8);
	// property.monthlyPayment = Math.round(property.mortgage / 480);
	// property.rent = Math.round(studio.totalPrice / 165);
	// property.cancel = Math.round(studio.totalPrice * 0.8);
	// property.refurbish = Math.round(studio.totalPrice * 0.2);
	// property.devaluation = 0;


	gameData.buy = function() {
		if (studio.moneyNeeded <= player.savings) {
			if (year == 1999) {
				setTimeout(month,1000);
			}
			gameData.properties.push({
				totalPrice: studio.totalPrice,
				mortgage: Math.round((studio.totalPrice * 0.8 * 1.2) + studio.totalPrice * 0.8),
				monthlyPayment: Math.round(((studio.totalPrice * 0.8 * 1.2) + studio.totalPrice * 0.8) / 480),
				rent: Math.round(studio.totalPrice / 165),
				cancel: Math.round(studio.totalPrice * 0.8),
				refurbish: Math.round(studio.totalPrice * 0.2),
				devaluation: 0
			})

			player.savings-= Math.round(studio.totalPrice * 0.2);
			gameData.playerSavings = player.savings;
			player.debt+= Math.round((studio.totalPrice * 0.8 * 1.2) + studio.totalPrice * 0.8);
			gameData.playerDebt = player.debt;

			console.log(gameData.properties.length - 1);
			setTimeout(propertyStatus(gameData.properties.length - 1),1000)
		}
	};

	// Function to update calendar and studio market price
	function month() {
		studio.totalPrice = Math.round(studio.totalPrice + studio.totalPrice * 0.006);
		studio.moneyNeeded = Math.round(studio.totalPrice * 0.2);

		if (counter%12 == 0) {
			year+= 1;
			counter = 0;
		}

		// console.log("------------------------------");
		// console.log(monthArray[counter] + " " + year);
		// console.log("studioPrice: " + studio.totalPrice);
		// console.log("------------------------------");

		counter +=1;
		setTimeout(month, 1000);
	};

	function propertyStatus(i) {
		gameData.properties[i].devaluation +=1;
		gameData.properties[i].totalPrice = Math.round(gameData.properties[i].totalPrice + gameData.properties[i].totalPrice * (0.006 - (gameData.properties[i].devaluation / 180 * 0.006)));
		gameData.properties[i].refurbish = Math.round(studio.totalPrice * 0.2);

		if (gameData.properties[i].cancel != 0) {
			gameData.properties[i].cancel-= Math.round(gameData.properties[i].monthlyPayment * 0.45);
		}

		if (gameData.properties[i].devaluation%12 == 0) {
			gameData.properties[i].rent = Math.round(gameData.properties[i].totalPrice / 165);
		}

		if (player.debt > 0) {
			player.savings+= gameData.properties[i].rent;
			player.savings-= gameData.properties[i].monthlyPayment;
			player.debt-= gameData.properties[i].monthlyPayment;
		} else {
			player.debt = 0;
			player.savings+= gameData.properties[i].rent;
		}

		$( ".refurbish" ).click(function() {
			if (gameData.properties[i].refurbish <= player.savings && gameData.properties[i].devaluation > 179) {
				player.savings-= gameData.properties[i].refurbish;
				gameData.properties[i].devaluation = 0;
				gameData.properties[i].totalPrice+= gameData.properties[i].totalPrice * 0.15;
			};
		});

		$( ".cancel" ).click(function() {
			if (gameData.properties[i].cancel <= player.savings) {
				player.savings-= gameData.properties[i].cancel;
				player.debt-= gameData.properties[i].mortgage;
				gameData.properties[i].mortgage = 0;
				gameData.properties[i].cancel = 0;
			}		
		});

		$( ".sell" ).click(function() {
			player.savings+= gameData.properties[i].totalPrice - gameData.properties[i].cancel;
			player.debt-= 0;
			gameData.properties.splice(0, 1);

			console.log(properties);
			return;
		});
		
		// console.log("------------------------------");
		// console.log("propertyPrice: " + property.totalPrice);
		// console.log("propertyRent: " + property.rent);
		// console.log("playerSavings: " + player.savings);
		// console.log("playerDebt: " + player.debt);
		// console.log("cancelMortgage: " + property.cancel);
		// console.log("propertyRefurbish: " + property.refurbish);
		// console.log("------------------------------");

		if (gameData.properties.length != 0) {
			setTimeout(propertyStatus(i), 1000);
		}
	};
});
	

