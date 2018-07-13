let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {
	console.log("Adding DB entry:" + JSON.stringify(event))



	for (var i = 0; i < event.Records.length; i++) {



		ddb.put({
			TableName: 'testlistener',
			Item: {
				'testid': Date.now().toString(),
				'message': event.Records[i].Sns.Message
			}
		}, function (err, data) {
			if (err) {
				console.log(err)
			} else {
				console.log(data)
			}
		});
	}

	callback(null, 'Successfully executed');
}