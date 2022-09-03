const axios = require("axios");
const logger = require("logger");

const config = {
    dbUri: process.env.DATABASE_URL || "http://54.221.176.157:8080/api/run-query",
    userTable: process.env.USER_TABLE_NAME || "suppliers"
}

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

const dbExecution = async (query) => {
    return await axios({
        method: 'post',
        url: config.dbUri,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            query
        }
    });
}

exports.handler = async (event) => {

    logger.log("fileName", 'Handler invoked', event, "info");
    
    try{
        const {email } = {...event.queryStringParameters};
        
        logger.log("fileName", 'event', `${email}`, "info");

        let query; 

        if(email){
            query = `SELECT * FROM ${config.userTable} WHERE email = '${email}'`
        }
        else{
            throw new Error('email is not valid');
        }
        
        logger.log("fileName", 'dbquery', `${query}`, "info");
        
        const dbResponse = await dbExecution(query);
        
        const {data} = {...dbResponse}

        logger.log("fileName", 'dbquery', `${data}`, "info");

        return createResponse(200, data);
    }
    catch(err){
        logger.log("fileName", 'handler', err.message, "error");
        return createResponse(400, err.message)
    }
}
