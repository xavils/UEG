$( document ).ready(function() {
	
	var counter = 0;
	var year = 2000;
	var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	var studio = {};
	studio.totalPrice = 100000;
	studio.moneyNeeded = Math.round(studio.totalPrice * 0.2);
	
	var player = {};
	player.savings = 38000;
	player.debt = 0;
	
	var properties = [];
	var property ={}	
	var devaluation = 0;


	property.mortgage = Math.round((studio.totalPrice * 0.8 * 1.2) + studio.totalPrice * 0.8);
	property.monthlyPayment = Math.round(studio.mortgage / 480);
	property.rent = Math.round(studio.totalPrice / 165);
	property.cancel = Math.round(studio.totalPrice * 0.8);
	property.refurbish = Math.round(studio.totalPrice * 0.2);



	$( ".buy" ).one( "click", function() {
  		setTimeout(month,1000);
	});

	$( ".buy" ).click(function() {
		properties.push(property)

		if (studio.moneyNeeded <= player.savings) {
			player.savings-= studio.totalPrice * 0.2;
			player.debt+= studio.mortgage;
		}

		console.log(properties);		
	});

	$( ".cancel" ).click(function() {
		if (studio.cancel <= player.savings) {
			player.savings-= studio.cancel;
			player.debt = 0;
		}		
	});

	$( ".sell" ).click(function() {
		player.savings+= studio.totalPrice - studio.cancel;
		player.debt = 0;
		studio.rent = 0;

	});

	$( ".refurbish" ).click(function() {
		player.savings-= studio.refurbish;
		devaluation = 0;
		studio.totalPrice+= studio.totalPrice * 0.15;

	});

	function month() {
		counter +=1;
		devaluation +=1;
		studio.totalPrice = Math.round(studio.totalPrice + studio.totalPrice * (0.006 - (devaluation / 180 * 0.006)));
		studio.moneyNeeded = Math.round(studio.totalPrice * 0.2);
		studio.cancel-= Math.round(studio.monthlyPayment * 0.45);

		if (counter%12 == 0) {
			studio.rent = Math.round(studio.totalPrice / 165);
			year+= 1;
			counter = 0;
		}

		if (player.debt >= 0) {
			player.savings+= studio.rent;
			player.savings-= studio.monthlyPayment;
			player.debt-= studio.monthlyPayment;
		} else {
			player.debt = 0;
			player.savings+= studio.rent;
		}
		
		console.log("------------------------------");
		console.log(monthArray[counter] + " " + year);
		// console.log("studioPrice: " + studio.totalPrice);
		// console.log("studioRent: " + studio.rent);
		// console.log("playerSavings: " + player.savings);
		// console.log("playerDebt: " + player.debt);
		// console.log("cancelMortgage: " + studio.cancel);
		console.log("------------------------------");
		setTimeout(month, 1000);
	};


});