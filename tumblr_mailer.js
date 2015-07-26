var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var myCsvFile = fs.readFileSync("friend_list.csv","utf8");
var myemailTemplate = fs.readFileSync('email_template.ejs', 'utf8');

var client = tumblr.createClient({
  consumer_key: 'key here',
  consumer_secret: 'key here',
  token: 'key here',
  token_secret: 'key here'
});

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('key here');


// Plan: use regex to get an array of line elements
// ignore the first element, which will be the header - until later when needed for building keys/value pairs
// use regex again to build individual arrays of each line (future object), stored in our parent array
// use loops or functional programming to create objects out of the array elements, with key/value
// pairs of the header elements and their associated values. refactor for efficiency.


var csvParse = function(csvfile) {
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


 function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
        // console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 }


client.posts('jsidneyrocket.tumblr.com', function(err, blog){
	var latestPosts = [];
	var thisDate =  new Date() ;
	blog.posts.forEach(function(post){
	  	var thisOtherDate = new Date(post.date)
	  	if (thisDate - thisOtherDate < 604800000) {
	  		latestPosts.push(post)
	  	}
	  
	  });


var myData = (csvParse(myCsvFile));

	 
myData.forEach(function(row){
	firstName = row['firstName'];
	numMonthsSinceContact = row['numMonthsSinceContact'];
	template = myemailTemplate;
			
			var customizedTemplate = ejs.render(template, {firstName: firstName,
									   numMonthsSinceContact: numMonthsSinceContact,
									   latestPosts: latestPosts									
			 });

			sendEmail(firstName, row["emailAddress"], "Daniel Labrie", "danrlabrie@gmail.com", "Hi!", customizedTemplate);			
			
		});
});	


