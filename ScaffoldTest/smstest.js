let AWS = require('aws-sdk');
const sns = new AWS.SNS();
exports.handler = function (event, context, callback) {

	for (var i = 0; i < event.items.length; i++) {
		sns.publish({
			Message: event.items.body,
			Subject: 'create',
			MessageAttributes: {},
			MessageStructure: 'String',
			TopicArn: 'arn:aws:sns:us-east-2:929157664971:cc_topic'
		}).promise()
			.then(data => {
				callback(null,event);
			})
			.catch(err => {
				callback(err);
			});

	}

	callback(null, 'Successfully executed');
}