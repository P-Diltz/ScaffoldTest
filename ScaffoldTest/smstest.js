let AWS = require('aws-sdk');
let http = require('http');
const ddb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();




exports.handler = (event, context, callback) => {


	http.get("https://g7rrfbiyb1.execute-api.us-east-2.amazonaws.com/prod/newapi/item/3", function (data) {

			for (var i = 0; i < data.length; i++) {
				sns.publish({
					Message: JSON.stringify(data[i]),
					Subject: 'create',
					MessageAttributes: {},
					MessageStructure: 'String',
					TopicArn: 'arn:aws:sns:us-east-2:929157664971:cc_topic'
				}).promise()
					.then(data => {
						callback(null, event);
					})
					.catch(err => {
						callback(err);
					});

			}
		
	}).on('error', function (err) {
        callback(err);
    });
;
	/*for (var i = 0; i < event.items.length; i++) {
		sns.publish({
			Message: event.items[i].body,
			Subject: 'create',
			MessageAttributes: {},
			MessageStructure: 'String',
			TopicArn: 'arn:aws:sns:us-east-2:929157664971:cc_topic'
		}).promise()
			.then(data => {
				callback(null, event);
			})
			.catch(err => {
				callback(err);
			});

	}*/
};