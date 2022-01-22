const AWS = require("aws-sdk");

module.exports = s3  = new AWS.S3({
    accessKeyId: 'antony' ,
    secretAccessKey: 'bp024Wbp024W' ,
    endpoint: 'http://127.0.0.1:9000' ,
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: 'v4'
});