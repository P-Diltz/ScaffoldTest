let doc = require('dynamodb-doc');

let dynamo = new doc.DynamoDB();

let AWS = require('aws-sdk');
const s3 = new AWS.S3();
let JSZip = require("jszip");
let fs = require("fs");
exports.handler = (event, context, callback) => {

	dynamo.getItem({
		Key: {
			course_id: parseInt(event.course)
		},
		TableName: "courses"
	}, (err, res) => {
		if (err) {
			callback(err);
		} else {
			event.title = res.Item.title;
			console.log(JSON.stringify(res));
			var file = event.title + ".imscc";
			var base = '<?xml version="1.0" encoding="UTF-8"?><manifest identifier="id97c484be5cfe5da7128eae721964d00" xmlns="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1" xmlns:lom="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource" xmlns:lomimscc="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/manifest" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1 http://www.imsglobal.org/profile/cc/ccv1p1/ccv1p1_imscp_v1p2_v1p0.xsd http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource http://www.imsglobal.org/profile/cc/ccv1p1/LOM/ccv1p1_lomresource_v1p0.xsd http://ltsc.ieee.org/xsd/imsccv1p1/LOM/manifest http://www.imsglobal.org/profile/cc/ccv1p1/LOM/ccv1p1_lommanifest_v1p0.xsd"> <metadata> <schema>IMS Common Cartridge</schema> <schemaversion>1.1.0</schemaversion> <lomimscc:lom> <lomimscc:general> <lomimscc:title> <lomimscc:string>{{title}}</lomimscc:string> </lomimscc:title> </lomimscc:general> <lomimscc:lifeCycle> <lomimscc:contribute> <lomimscc:date> <lomimscc:dateTime>2018-06-15</lomimscc:dateTime> </lomimscc:date> </lomimscc:contribute> </lomimscc:lifeCycle> <lomimscc:rights> <lomimscc:copyrightAndOtherRestrictions> <lomimscc:value>yes</lomimscc:value> </lomimscc:copyrightAndOtherRestrictions> <lomimscc:description> <lomimscc:string>Private (Copyrighted) - http://en.wikipedia.org/wiki/Copyright</lomimscc:string> </lomimscc:description> </lomimscc:rights> </lomimscc:lom> </metadata> <organizations> <organization identifier="org_1" structure="rooted-hierarchy"> {{organization}} </organization> </organizations> <resources> {{resources}} </resources></manifest>'
			
			base = base.replace(/\{\{title\}\}/, event.title);
			var zip = new JSZip();
			zip.file("imsmanifest.xml", base);
			let tmpPath = `/tmp/${file}`
			zip.generateNodeStream({ streamFiles: true })

				.pipe(fs.createWriteStream(tmpPath))

				.on('error', err => callback(err))

				.on('finish', function () {

			

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

							console.log(`Successfully uploaded ${event.path}`);

							callback(null, event);

						})

						.catch(err => {

							callback(err);

						});

				});

		}
	});
};