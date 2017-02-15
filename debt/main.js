///// 	WRITTEN BY NICK MCBURNEY
/////		www.nickmcburney.co.uk

// class to represent a row in the debts table
var DebtInfo = function(amount, interest, term) {
	//this.amount = ko.observable(amount);
	this.amount = ko.observable(amount);
	this.formattedAmount = ko.pureComputed({
        read: function () {
            return formatCurrency(this.amount());
        },
        write: function (value) {
            // Strip out unwanted characters, parse as float, then write the
            // raw data back to the underlying "price" observable
            value = parseFloat(value.replace(/[^\.\d]/g, ""));
            this.amount(isNaN(value) ? 0 : value); // Write to underlying storage
        },
        owner: this
    });

	this.interest = ko.observable(interest);
	this.term = ko.observable(term);

	// calculate monthly payments per debt
	this.monthlyRepayments = ko.computed(function() {
		var $creditBalance = this.amount(),
			 $interestRate = this.interest(),
			 $interestRate = $interestRate.replace(/%/g, ""),
			 $repaymentLength = this.term();

		// calculate repayments with interest
		var rateCalc = $interestRate / 1200;
		var rateCalc2 = 1 + rateCalc;
		var rateCalc2Result = Math.pow(rateCalc2, $repaymentLength);

		var rateCalc3 = rateCalc * rateCalc2Result;
		var ratecalc3b = rateCalc2Result - 1;
		var rateCalc3Result = rateCalc3 / ratecalc3b;


		// calculate monthly rate
		var monthlyRate = rateCalc3Result * $creditBalance;
		// format monthly rate
		//monthlyRate = monthlyRate.toFixed(2);

		// if all fields filled show monthly rate otherwise hide
		if(isNaN(monthlyRate) || !isFinite(monthlyRate)) {
			return false
		} else {
			return monthlyRate
		}
	}, this);

	// calculate total repaid per debt
	this.totalRepaid = ko.computed(function() {
		var P = this.amount();
		var r = this.interest() / 100 / 12;
		var N = this.term();
		// calculate total paid with interest
		var A = P * (r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1)
		var totalRepaid = A * N;
		//totalRepaid = totalRepaid.toFixed(2);
		var TI = (A * N) - P;

		// if all fields filled show total paid otherwise hide
		if(isNaN(totalRepaid)) {
			return false
		} else {
			return totalRepaid
		}
	}, this);
}


// class to represent a loan option
var loansAvailble = function(loanAmount, apr, loanTerm, monthlyPayments) {
	this.loanAmount = ko.observable(loanAmount);
	this.apr = ko.observable(apr);
	this.loanTerm = ko.observable(loanTerm);
	this.monthlyPayments = ko.observable(monthlyPayments);
}



// viewmodel
function DebtViewModel() {
	var self = this;

	// create array of debts and add three to start
	self.debts = ko.observableArray([
		new DebtInfo("", "", "", ""),
		new DebtInfo("", "", "", ""),
		new DebtInfo("", "", "", "")
	]);



	// calculate total debt amount
	self.totalDebtAmount = ko.computed(function() {
		var totalAmount = 0;
		// run through each debt
		for(var i=0; i< self.debts().length; i++) {
			// add debts together
			totalAmount += Number(self.debts()[i].amount());
		}
		return totalAmount
	}, this);

	// calculate average interest
	self.averageInterest = ko.computed(function() {
		var averageInterest = 0;
		var interestCounter = 0;
		// run through each debt
		for(var i=0; i< self.debts().length; i++) {
			// check interest not zero
			if(self.debts()[i].interest() > 0) {
				// add interest
				averageInterest += Number(self.debts()[i].interest());
				// add to counter for dividing
				interestCounter += 1;
			}
		}
		// divide total interest by number of loans with interest above zero (interest counter)
		averageInterest = averageInterest / interestCounter
		// formatt number to 2 decimal places
		averageInterest = averageInterest.toFixed(2)
		// return the average interest
		return averageInterest
	}, this);

	// calculate total monthly payments
	self.totalMonthlyPayments = ko.computed(function() {
		var totalMonthly = 0;
		// run through each debt
		for(var i=0; i< self.debts().length; i++) {
			// add monthly payments together
			var monthlyPayment = self.debts()[i].monthlyRepayments();
			// set variable to strict number formatt
			totalMonthly += Number(monthlyPayment);
		}
		// return the total monthly payments
		//totalMonthly = totalMonthly.toFixed(2);
		return totalMonthly
	}, this);

	// calculate loan term
	self.loanTerm = ko.computed(function() {
		var loanTerm = [];
		// run through each debt
		for(var i=0; i< self.debts().length; i++) {
			// get loan term
			var singleTerm = self.debts()[i].term()
			// add loan term to array
			loanTerm.push(singleTerm);
		}
		// get maximum term from loan term array
		loanTerm = Math.max.apply(Math, loanTerm);
		// return the maximum loan term input
		return loanTerm
	}, this);



	///////////////////////////////////////////
	// show results will be set to 'true' once submit button clicked
	self.showResults = ko.observable(false)
	self.showLoanOptions = ko.observable(false)

	// calculate debts (on submit hit)
	self.calculateDebt = function(index) {
		// show results
		self.showResults(true);

		// reset loans (necessary if user enters more debts after clicking submit)
		self.loansAvailble([])

		// find best loan for user based on current debt and monthly payments
		findLoan(self.totalDebtAmount(), self.totalMonthlyPayments(), self.loanTerm())

		console.log("Loans available: " + self.loansAvailble().length)

		if(self.loansAvailble().length){
			self.showLoanOptions(true)
		}
	}


	// add additional debts
	self.addDebt = function() {
		self.debts.push(new DebtInfo("", "", ""));
	};

	// remove debt
	self.removeDebt = function(debts) {
		self.debts.remove(debts)
	};

	// create loans available array to consolidate debts
	self.loansAvailble = ko.observableArray([]);


	// LOAN FINDER FUNCTIONALITY
	// all personal loans available
	var loansAvailable = [{
		loanAmount: 2000,
		loanTerm: [24,30,36],
		apr: 34.9
	}, {
		loanAmount: 2500,
		loanTerm: [24,30,36],
		apr: 34.9
	}, {
		loanAmount: 3000,
		loanTerm: [24,30,36],
		apr: 39.9
	}, {
		loanAmount: 3500,
		loanTerm: [24,30,36,42],
		apr: 44.9
	}, {
		loanAmount: 4000,
		loanTerm: [24,30,36,42, 48],
		apr: 44.9
	}, {
		loanAmount: 4500,
		loanTerm: [24,30,36,42, 48],
		apr: 44.9
	}, {
		loanAmount: 5000,
		loanTerm: [24,30,36,42, 48],
		apr: 44.9
	}];

	// FUNCTION: find best loan for user based on current debt and monthly payments
	var findLoan = function(totalDebt, monthlyPayments, loanTerm){
		if(totalDebt < 1500) {
			alert("debt to small")
		} else if(totalDebt <= 2000) {
			consolidateLoanPL(monthlyPayments,0)
		} else if(totalDebt <= 2500){
			consolidateLoanPL(monthlyPayments,1)
		} else if(totalDebt <= 3000){
			consolidateLoanPL(monthlyPayments,2)
		} else if(totalDebt <= 3500){
			consolidateLoanPL(monthlyPayments,3)
		} else if(totalDebt <= 4000){
			consolidateLoanPL(monthlyPayments,4)
		} else if(totalDebt <= 4500){
			consolidateLoanPL(monthlyPayments,5)
		} else if(totalDebt <= 5000){
			consolidateLoanPL(monthlyPayments,6)
		} else if(totalDebt >= 10000 && totalDebt <= 250000){
			consolidateLoanHOL(monthlyPayments,loanTerm,totalDebt)
		}
	}

	// FUNCTION: find out which loan term is suitable from similar loan amount based on current payments
	var consolidateLoanPL = function(currentPayments, appropriateLoan) {
		var $creditBalance = loansAvailable[appropriateLoan].loanAmount,
			 $repaymentLength = loansAvailable[appropriateLoan].loanTerm,
			 $interestRate = loansAvailable[appropriateLoan].apr;

		for(var r=0; r< $repaymentLength.length; r++) {
			// calculate monthly rate
			var monthlyRate = oceanMonthlyCalc($creditBalance,$repaymentLength[r],$interestRate)
			// format monthly rate
			//monthlyRate = monthlyRate.toFixed(2);
			// only show loans with lower monthly payments
			if(monthlyRate < currentPayments) {
				// add available loan
				self.loansAvailble.unshift(new loansAvailble(
					loansAvailable[appropriateLoan].loanAmount,
					loansAvailable[appropriateLoan].apr,
					loansAvailable[appropriateLoan].loanTerm[r],
					monthlyRate
				));
			}
		}
	}

	// homeowner loan loan finder
	var consolidateLoanHOL = function(currentPayments,loanTerm, totalDebt) {
		// array to contain loan amounts
		var $suggestedLoanTerms = [{
			// round up to nearest 1000
			loanTerm: (Math.ceil(loanTerm/12)*12) + 24
		}, { // round up and plus 1000
			loanTerm: (Math.ceil(loanTerm/12)*12) + 60
		}, { // round up and plus 5000
			loanTerm: (Math.ceil(loanTerm/12)*12) + 120
		}]

		// round loan amount up to nearest 1000
		var $suggestedLoanAmount = (Math.ceil(totalDebt/1000)*1000)

		// find APR
		var $APR;
		if($suggestedLoanAmount >= 10000 && $suggestedLoanAmount <= 25000) {
			$APR = 5.9;
		} else if($suggestedLoanAmount > 25000 && $suggestedLoanAmount <= 45000) {
			$APR = 6.4;
		} else if($suggestedLoanAmount > 45000 && $suggestedLoanAmount <= 65000) {
			$APR = 5.8;
		} else if($suggestedLoanAmount > 65000 && $suggestedLoanAmount <= 250000) {
			$APR = 5.4;
		}

		for(var t=0; t< $suggestedLoanTerms.length; t++) {
			// calculate monthly rate
			var monthlyRate = oceanMonthlyCalc($suggestedLoanAmount,$suggestedLoanTerms[t].loanTerm,$APR)
			// format monthly rate

			// only show loans with lower monthly payments
			if(monthlyRate < currentPayments) {
				// add available loan
				self.loansAvailble.unshift(new loansAvailble(
					$suggestedLoanAmount,
					$APR,
					$suggestedLoanTerms[t].loanTerm,
					monthlyRate
				));
			}
		}
	}
}

// INITIALISE KNOCKOUT.JS
ko.applyBindings(new DebtViewModel());


function oceanMonthlyCalc($balance,$term,$apr){
	var aprmonthly = 100 * (Math.pow((1 + $apr / 100), 1 / 12) - 1);
	aprmonthly = aprmonthly.toFixed(4)

	var actualcalc = aprmonthly * 12

	var n = $term - (2 * $term)
	var R = actualcalc / 1200
	var Pv = $balance
	var Left = Pv * R
	var Right = 1 - Math.pow((1 + R), n)
	var MonthlyPayment = (Left / Right)

	return MonthlyPayment
}

function formatCurrency(value) {
	if(value){
		nStr = value.toFixed(2);
		nStr = nStr.replace(/,/g, "");
		nStr = nStr.replace(/₽/g, "");
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		if(x.length > 1 && x[1] != "00") {
			x2 = '.' + x[1];
		} else {
			x2 = ''
		}
		//x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return "₽" + x1 + x2;
	}
}



function formatMonths(months) {
	if(months){
		var years = months / 12; // 1
		var remainingMonths = months % 12;
		console.log(years + " Years and " + remainingMonths + " months")

		years = Math.floor(years);

		var formatted = ""
		if(remainingMonths >= 1 && years < 1){
			formatted = remainingMonths + " месяцев"
		} else if(years >= 1 && remainingMonths < 1){
			formatted = years + " лет"
		} else if(years >= 1 && remainingMonths >= 1 && remainingMonths == 6){
			formatted = years + "½ года"
		} else if(years >= 1 && remainingMonths >= 1){
			console.log("years and months")
			formatted = years + " лет и " + remainingMonths + " месяцев"
		} else {
			formatted = ""
		}

		return formatted;
	}
}
