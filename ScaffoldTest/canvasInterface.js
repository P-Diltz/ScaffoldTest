let AWS = require('aws-sdk');
let request = require('request');
let url = "http://ec2-18-222-105-76.us-east-2.compute.amazonaws.com/api/v1/";
let key = "access_token=l9hlJuDTgUY1Q5TygZC7yw7CxZU8tXyJx4Gh93QOxAEI2yihpNt21nZSXujD554R"
exports.handler = function(event, context, callback) {
	var type = event.type;
	var suffex = event.suffex;
	var data = event.data;

	switch(type){
		case "POST":
		url+= suffex + "?" + key;
break;
		case "PUT":
		url+= suffex + "?" + key;
break;
		default:
		var da = "&" + data.join("&");
 		url+= suffex + "?" + key + da;
		break;
	}
	callback(null,url);
}