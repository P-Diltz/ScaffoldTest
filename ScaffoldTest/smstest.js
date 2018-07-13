let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();



exports.handler = (event, context, callback) => {
	//console.log('Received event:', JSON.stringify(event, null, 2));


	if (event.pathParameters['course']) {


	ddb.query({
		TableName: 'learning_objects',
		IndexName: "course-index",
		ExpressionAttributeValues: {
			":c": event.pathParameters['course']
		},
		ProjectionExpression: "objectID,title,parent",
		KeyConditionExpression: "course = :c",
	}, function (err, data) {
		if (err) {
			//handle error
		} else {
			//your logic goes here
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
	}

};