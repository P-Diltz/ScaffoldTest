const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
let AWS = require('aws-sdk');
let JSZip = require("jszip");
let fs = require("fs");

const s3 = new AWS.S3();
exports.handler = function (event, context, callback) {
	var file = "Demo Course 3.imscc";
	var item = event.Items[event.processed];

	var name = item.title + ".json"
	console.log(item);
	dynamo.getItem({
		"TableName": "learning_objects",
		"Key": {
			objectID: item.objectID,
		}
	}, (err, cdata) => {
		if (err) { callback(err); } else {
			var changes = {};
			changes[name] = cdata;

				s3.getObject({
				'Bucket': "zipedits",
				'Key': name
			}).promise()

				.then(data => {

					let jszip = new JSZip();

					console.log(`Opening ${name}`);

					jszip.loadAsync(data.Body).then(zip => {

						console.log(`Opened ${name} as zip`);

						Object.keys(changes).forEach(name => {

							if (changes[name] !== null) {

								console.log(`Modify ${name}`);

								zip.file(name, changes[name]);

								modified++;

							} else {

								console.log(`Remove ${name}`);

								zip.remove(name);

								removed++;

							}

						});

						let tmpPath = `/tmp/${name}`

						console.log(`Writing to temp file ${tmpPath}`);

						zip.generateNodeStream({ streamFiles: true })

							.pipe(fs.createWriteStream(tmpPath))

							.on('error', err => callback(err))

							.on('finish', function () {

								console.log(`Uploading to ${name}`);

								s3.putObject({
									"Body": fs.createReadStream(tmpPath),
									"Bucket": "zipedits",
									"Key": name,
									"Metadata": {
										"Content-Length": String(fs.statSync(tmpPath).size)
									}
								})

									.promise()

									.then(data => {

										console.log(`Successfully uploaded ${name}`);

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

