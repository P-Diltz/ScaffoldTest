let request = require('request');

exports.handler = function (event, context, callback) {
	console.log("Adding DB entry:" + JSON.stringify(event))
	var file = "Demo Course 3.imscc";
	for (var i = 0; i < event.Records.length; i++) {
		var item = JSON.parse(event.Records[i].Sns.Message);
		var name = item.title + ".json"
		console.log(item);
		request('https://g7rrfbiyb1.execute-api.us-east-2.amazonaws.com/prod/newapi/item?item=' + item.objectID, { json: true }, (err, res, cdata) => {
			if (err) { callback(err); } else {
				var changes = {};
				changes[name] = cdata;
				var options = {
					uri: 'https://5a3kmwmhr8.execute-api.us-east-2.amazonaws.com/Prod/edit',
					method: 'POST',
					json: {
						"path": file,
						"changes":JSON.stringify(changes)
					}
				};
				console.log(options);
				request(options, function (error, response, body) {
					if (!error) {
						callback(JSON.stringify(body)) // Print the shortened url.
					}else{
						callback(JSON.stringify(error));
					}
				});
			}

		});

	}


}


