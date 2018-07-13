let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();



exports.handler = (event, context, callback) => {


	ddb.query({
		"TableName": "learning_objects",
		"IndexName": "course-index",
		"KeyConditionExpression": "course = :c",
		"ExpressionAttributeValues": {
			":c": event.course.toString()
		},
		"ProjectionExpression": "objectID,title,parent",
		"ScanIndexForward": false
	}, function (err, data) {
		if (err) {
			callback(err);
		} else {
			for (var i = 0; i <data.length; i++) {
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