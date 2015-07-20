var fs = require('fs');

var readFile = fs.readFileSync("friend_list.csv","utf8");

// Plan: use regex to get an array of line elements
// ignore the first element, which will be the header - until later when needed for building keys/value pairs
// use regex again to build individual arrays of each line (future object), stored in our parent array
// use loops or functional programming to create objects out of the array elements, with key/value
// pairs of the header elements and their associated values. refactor for efficiency.


var csvParse = function(file) {
	var csvfile = fs.readFileSync(file,"utf8");
	var linesofdata = csvfile.split('\n')
	var elementsarray = []
	var outputarray = []
	for(var i = 0; i < linesofdata.length; i++) {
		elementsarray.push(linesofdata[i].split(","));
	}
	for(var j = 1; j< elementsarray.length; j++) {
		var objecto = {}
		for(var k = 0; k< elementsarray[0].length; k++) {
		
		objecto[elementsarray[0][k]] = elementsarray[j][k]
		}
	outputarray.push(objecto)	
	}
		return outputarray
}


console.log(csvParse("friend_list.csv"));
