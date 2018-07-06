let AWS = require('aws-sdk');

let JSZip = require("jszip");

let fs = require("fs");

const s3 = new AWS.S3();
exports.handler = function (event, context, callback) {

	var zip = new JSZip();
	zip.file("k16.txt", "generated");
	let tmpPath = `/tmp/${event.path}`
	zip.generateNodeStream({ streamFiles: true })

					.pipe(fs.createWriteStream(tmpPath))

					.on('error', err => callback(err))

					.on('finish', function () {

						console.log(`Uploading to ${event.path}`);

						s3.putObject({
							"Body": fs.createReadStream(tmpPath),
							"Bucket": "zipedits",
							"Key": event.path,
							"Metadata": {
								"Content-Length": String(fs.statSync(tmpPath).size)
							}
						})

							.promise()

							.then(data => {

								console.log(`Successfully uploaded ${event.path}`);

								callback(null, {

									created: event.path

								});

							})

							.catch(err => {

								callback(err);

							});

					});
	callback(null, 'Successfully executed');
}