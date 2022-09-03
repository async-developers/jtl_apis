const AWS = require('aws-sdk');
const logger = require('logger');
const BUCKET_NAME = 'jtl-eticket-voucher-data';

const createResponse = (statusCode, body) => {
    const response = {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
      },
      body: JSON.stringify(body),
      isBase64Encoded: false
    };
  
    logger.log("", 'createResponse: creating response', response, "info");
    return response;
};


const uploadToS3 = async(fileName, fileContent) => {
    logger.log("fileName", 'inside try block', fileName +  " " + typeof fileContent, "info");
    let s3bucket = new AWS.S3({
        Bucket: BUCKET_NAME
    });
    
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: new Buffer(fileContent, 'binary'),
        ContentType: "application/pdf"
    };
    
    try{
        logger.log("fileName", 'inside try block', params, "info");
        await s3bucket.putObject(params).promise();
        logger.log("fileName", 'exiting try block', "success", "info");
        return createResponse(200, []);
    }
    catch(err){
        logger.log("fileName", 'error', err, "error");    
        return createResponse(400, []);
    }
}

exports.handler = async (event) => {
    logger.log("fileName", 'event', event, "info");
    const body =JSON.parse(event.body);
    logger.log("fileName", 'body', body, "info");
    const { fileName, fileBody } = { ...body };
    return await uploadToS3(fileName, fileBody);
}