let AWS = require('aws-sdk');
let request = require('request');

let JSZip = require("jszip");

let fs = require("fs");

const s3 = new AWS.S3();

const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {
	console.log("Adding DB entry:" + JSON.stringify(event))
	var file = "test.imscc";
	for (var i = 0; i < event.Records.length; i++) {
		var item = JSON.parse(event.Records[i].Sns.Message);
		var name = item.title + ".json"
		request('https://g7rrfbiyb1.execute-api.us-east-2.amazonaws.com/prod/newapi/item?item=' + item.objectID, { json: true }, (err, res, cdata) => {
			if (err) { callback(err); } else {
				var changes = {};
				changes[name] = cdata;
				var options = {
					uri: 'https://5a3kmwmhr8.execute-api.us-east-2.amazonaws.com/Prod/edit',
					method: 'POST',
					json: {
						"path": file,
						"changes":changes
					}
				};
				request(options, function (error, response, body) {
					if (!error) {
						console.log(body) // Print the shortened url.
					}
				});
			}

		});

	}


}


