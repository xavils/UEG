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

	property.totalPrice = studio.totalPrice;
	property.mortgage = Math.round((studio.totalPrice * 0.8 * 1.2) + studio.totalPrice * 0.8);
	property.monthlyPayment = Math.round(property.mortgage / 480);
	property.rent = Math.round(studio.totalPrice / 165);
	property.cancel = Math.round(studio.totalPrice * 0.8);
	property.refurbish = Math.round(studio.totalPrice * 0.2);
	property.devaluation = 0;

	$( ".buy" ).one( "click", function() {
  		setTimeout(month,1000);
	});

	$( ".buy" ).click(function() {
		if (studio.moneyNeeded <= player.savings) {
			properties.push(property)
			player.savings-= property.totalPrice * 0.2;
			player.debt+= property.mortgage;

			setTimeout(propertyStatus,1000)
		}
	});

	function month() {
		counter +=1;
		studio.totalPrice = Math.round(studio.totalPrice + studio.totalPrice * 0.006);
		studio.moneyNeeded = Math.round(studio.totalPrice * 0.2);

		if (counter%12 == 0) {
			year+= 1;
			counter = 0;
		}

		console.log("------------------------------");
		console.log(monthArray[counter] + " " + year);
		console.log("studioPrice: " + studio.totalPrice);
		console.log("------------------------------");

		setTimeout(month, 1000);
	};

	function propertyStatus() {
		property.devaluation +=1;
		property.totalPrice = Math.round(property.totalPrice + property.totalPrice * (0.006 - (property.devaluation / 180 * 0.006)));
		property.refurbish = Math.round(studio.totalPrice * 0.2);

		if (property.cancel != 0) {
			property.cancel-= Math.round(property.monthlyPayment * 0.45);
		}

		if (property.devaluation%12 == 0) {
			property.rent = Math.round(property.totalPrice / 165);
		}

		if (player.debt > 0) {
			player.savings+= property.rent;
			player.savings-= property.monthlyPayment;
			player.debt-= property.monthlyPayment;
		} else {
			player.debt = 0;
			player.savings+= property.rent;
		}

		$( ".refurbish" ).click(function() {
			if (property.refurbish <= player.savings && property.devaluation > 179) {
				player.savings-= property.refurbish;
				property.devaluation = 0;
				property.totalPrice+= property.totalPrice * 0.15;
			};
		});

		$( ".cancel" ).click(function() {
			if (property.cancel <= player.savings) {
				player.savings-= property.cancel;
				player.debt-= property.mortgage;
				property.mortgage = 0;
				property.cancel = 0;
			}		
		});

		$( ".sell" ).click(function() {
			player.savings+= property.totalPrice - property.cancel;
			player.debt-= 0;
			properties.splice(0, 1);

			console.log(properties);
		});
		
		console.log("------------------------------");
		console.log("propertyPrice: " + property.totalPrice);
		console.log("propertyRent: " + property.rent);
		console.log("playerSavings: " + player.savings);
		console.log("playerDebt: " + player.debt);
		console.log("cancelMortgage: " + property.cancel);
		console.log("propertyRefurbish: " + property.refurbish);
		console.log("------------------------------");

		if (properties.length != 0) {
			setTimeout(propertyStatus, 1000);
		}
	}

});