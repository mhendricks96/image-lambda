const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = async (event) => {
    console.log(event.Records[0].s3)
    const fileName = event.Records[0].s3.object.key;
    const bucketName = event.Records[0].s3.bucket.name;
    const fileSize = event.Records[0].s3.object.size;
    
    let metaData = {
        name: fileName,
        size: fileSize,
        typle: 'image'
    }
    
    console.log(bucketName)

    try {
        let manifestBody = await S3.getObject({Bucket: bucketName, Key: 'images.json'}).promise();
        
        let manifestJSON = JSON.parse(manifestBody.Body.toString())
        
        manifestJSON.push(metaData);
        
        let newManifest = S3.putObject({
            Bucket: bucketName,
            Key: 'images.json',
            Body: JSON.stringify(manifestJSON),
        }).promise();
        
        
        const response = {
        statusCode: 200,
        body: JSON.stringify(newManifest),
        };
        return response;
        
    } catch (e) {
        console.log(e.errorType);
        
        let manifest = [metaData];
        
        let newManifest = await S3.putObject({
            Bucket: bucketName,
            Key: 'images.json',
            Body: JSON.stringify(manifest),
        }).promise();
        
        return {
            message: "Created new manifest",
            Bpdy: JSON.stringify(newManifest)
        }
    }
    console.log(manifest);
}
   