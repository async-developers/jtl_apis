const axios = require("axios");
const logger = require("logger");
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const config = {
    dbUri: process.env.DATABASE_URL || "http://localhost:8080/api/run-query",
    table: process.env.TABLE_NAME || "suppliers"
}

const ACCOUNT_REGISTRATION_SUCCESS = "Account registered successfully";
const RECORD_ALREADY_EXIST = "User already exist";
const BAD_REQUEST = "Bad Request"

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
    logger.log("index.js", 'dbexecution query', query, "info");
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

const getHashedPassword = async (password) => {    
    try{
        logger.log("index.js", 'getHashedPassword', password, "info");
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, saltRounds);
            return hashedPassword;
        }
        else{
            logger.log("index.js", 'getHashedPassword', 'Invalid Request', "info");
            throw new Error("Invalid Request")
        }
    }
    catch(err){
        logger.log("index.js", 'getHashedPassword', err.message, "info");
    }
};

exports.handler = async (event) => {    
    try{
        logger.log("index.js", 'register', event, "info");
        
        const body =JSON.parse(event.body);
        logger.log("index.js", 'register', body, "info");
        const {userName, email, password, accessLevel, productId} = body;
        
        logger.log("index.js", 'register', userName, "info");
        logger.log("index.js", 'register', email, "info");
        logger.log("index.js", 'productId', productId, "info");
        
        const existingRecordQuery = `SELECT * FROM ${config.table} WHERE email='${email}'`;
        const {data} = await dbExecution(existingRecordQuery);
        if(data.length){
            return createResponse(400, {message: RECORD_ALREADY_EXIST})
        }
        const hashedPassword = await getHashedPassword(password);
        const query = `INSERT into ${config.table} ( username, email, password, accesslevel, productId, createdAt, updatedAt) values ('${userName}', '${email}', '${hashedPassword}', ${accessLevel}, ${productId}, '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}')`;
        await dbExecution(query);
        return createResponse(200, {message:ACCOUNT_REGISTRATION_SUCCESS});
    } catch (error) {
        logger.log("index.js", 'register', error.message, "info");
        return createResponse(400, {message: BAD_REQUEST})
    }
};
