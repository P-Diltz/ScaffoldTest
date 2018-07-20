let AWS = require('aws-sdk');
let request = require('request');

let JSZip = require("jszip");

let fs = require("fs");

const s3 = new AWS.S3();

const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {
	console.log("Adding DB entry:" + JSON.stringify(event))
	var file = "course3.imscc";
	for (var i = 0; i < event.Records.length; i++) {
		var item = JSON.parse(event.Records[i].Sns.Message);
		var name = item.title + ".json"
		request('https://g7rrfbiyb1.execute-api.us-east-2.amazonaws.com/prod/newapi/item?item=' + item.objectID, { json: true }, (err, res, cdata) => {
			if (err) { callback(err); } else {
				let modified = 0, removed = 0;
				s3.getObject({
					'Bucket': "zipedits",
					'Key': file
				}).promise()
					.then(data => {
						let jszip = new JSZip();
						jszip.loadAsync(data.Body).then(zip => {

							zip.file(name, cdata);

							modified++;

							let tmpPath = `/tmp/${file}`

							console.log(`Writing to temp file ${tmpPath}`);

							zip.generateNodeStream({ streamFiles: true })

								.pipe(fs.createWriteStream(tmpPath))

								.on('error', err => callback(err))

								.on('finish', function () {

									
									console.log(`Uploading to ${file}`);

									s3.putObject({
										"Body": fs.createReadStream(tmpPath),
										"Bucket": "zipedits",
										"Key": file,
										"Metadata": {
											"Content-Length": String(fs.statSync(tmpPath).size)
										}
									})

										.promise()

										.then(data => {

											console.log(`Successfully uploaded ${file}`);

											callback(null, {

												modified: modified,

												removed: removed

											});

										})

										.catch(err => {

											callback(err);

										});

								});

						})

							.catch(err => {

								callback(err);

							});

					})

					.catch(err => {

						callback(err);

					});
			}

		});

	}


}


