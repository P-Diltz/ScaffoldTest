let AWS = require('aws-sdk');
let request = require('request');
let url = "";
let key = ""
exports.handler = function(event, context, callback) {
	var type = event.type;
	var suffex = event.suffex;
	var data = event.data;

	switch(type){
		case "POST":
		url+= suffex + "?" + key;

		case "PUT":
		url+= suffex + "?" + key;

		default:
		url+= suffex + "?" + key + data.join("&");
	}


	callback(null,url);
}