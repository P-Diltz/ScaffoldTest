let AWS = require('aws-sdk');
let request = require('request');
const ddb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();




exports.handler = (event, context, callback) => {

console.log("https://g7rrfbiyb1.execute-api.us-east-2.amazonaws.com/prod/newapi/item/" + event.course);
	request("https://g7rrfbiyb1.execute-api.us-east-2.amazonaws.com/prod/newapi/item/" + event.course, { json: true }, (err, res, data) => {
		if (err) { return console.log(err); }else{
		console.log(data);
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
		}
		
	});

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