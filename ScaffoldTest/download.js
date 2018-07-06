let AWS = require('aws-sdk');
const s3 = new AWS.S3();
exports.handler = function (event, context, callback) {
/*	s3.getObject({
		'Bucket': "zipedits",
		'Key': event.pathParameters['item']
	}).promise()
		.then(data => {*/
			callback(null,{
        statusCode:  '200',
        body: JSON.stringify(event),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true
        }
    })
	/*	})
		.catch(err => {
			callback(err); // an error occurred
		});
*/

	
}