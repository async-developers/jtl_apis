const axios = require("axios");
const logger = require("logger");

const config = {
    dbUri: process.env.DATABASE_URL || "http://3.111.249.220:8080/api/run-query",
    websiteTable: process.env.WEBSITE_TABLE || "products_list_table"
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
    logger.log("", 'dbexecution query', query, "info");
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

        const {id} = {...event.queryStringParameters};

        let queryOne = `SELECT * from ${config.websiteTable} where productId= '${id}'`;
         
        const dbResponse = await  dbExecution(queryOne);
        
        const  {data} = dbResponse;

        return createResponse(200, data);
    }
    catch(err){
        logger.log("fileName", 'handler', err.message, "error");
        return createResponse(400, err.message)
    }
}