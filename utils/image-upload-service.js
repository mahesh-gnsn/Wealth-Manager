const AWS = require('aws-sdk');

async function getSignedPutUrl(fileName, type) {
    try {
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            apiVersion: '2006-03-01', //sasi to confirm from AWS
            region: 'eu-central-1' //sasi to confirm from AWS
        });
        return await s3.getSignedUrl('putObject', { Bucket: process.env.AWS_BUCKET_NAME_IMAGE, ContentType: type, Key: fileName, Expires: 604800 });
    } catch (exception) {
        console.error(exception.message)
        return '';
    }
}

async function getSignedGetUrl(fileName) {
    try {
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            apiVersion: '2006-03-01', //sasi to confirm from AWS
            region: 'eu-central-1' //sasi to confirm from AWS
        });
        return await s3.getSignedUrl('getObject', { Bucket: process.env.AWS_BUCKET_NAME_IMAGE, Key: fileName, Expires: 604800 });
    } catch (exception) {
        console.error(exception.message)
        return '';
    }
}

module.exports.getSignedPutUrl = getSignedPutUrl;
module.exports.getSignedGetUrl = getSignedGetUrl;