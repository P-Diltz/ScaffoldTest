let AWS = require('aws-sdk');
const s3 = new AWS.S3();
exports.handler = function (event, context, callback) {
	s3.getObject({
		'Bucket': "zipedits",
		'Key': event.pathParameters['item']
	}).promise()
		.then(data => {
			callback(null,data)
		})
		.catch(err => {
			callback(err); // an error occurred
		});


	
}