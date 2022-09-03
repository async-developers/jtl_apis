const axios = require("axios");
const logger = require("logger");
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');

const config = {
    dbUri: process.env.DATABASE_URL || "http://localhost:8080/api/run-query",
    table: process.env.TABLE_NAME || "auth",
    TOKEN_TIMEOUT: process.env.TOKEN_TIMEOUT || "30m"
}

const secret = 'jomTravellocal';
const USER_DOES_NOT_EXIST = "User doesn't exist";
const INTERNAL_SERVER_ERROR = "Internal Server Error";
const BAD_REQUEST = "Bad Request";

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

const validatePassword = async (userDetails, password) => {    
    try{
        const {password: hashedPassword} = userDetails;

        logger.log("index.js", 'validatePassword', password, "info");
        let isValidUser = false;
        if (password && hashedPassword) {
            isValidUser = await bcrypt.compare(password, hashedPassword);
        }
        else{
            logger.log("index.js", 'validatePassword', 'Invalid Request', "info");
        }
        return isValidUser
    }
    catch(err){
        logger.log("index.js", 'validatePassword', err.message, "info");
    }
};

const generateAccessToken = async (payload) => {
    const token = await jwt.sign(payload, secret, {
        expiresIn: config.TOKEN_TIMEOUT
    });
    console.log("token",token);
    return token;
}

exports.handler = async (event) => {    
    try{
        logger.log("index.js", 'login', event, "info");
        const {email, password} = JSON.parse(event.body);
        const userRecordQuery = `SELECT * FROM suppliers WHERE email='${email}'`;
        const {
            data :{
                0: userRecord
            }
        } = await dbExecution(userRecordQuery);
        
        if(!userRecord){
            return createResponse(400, {message: USER_DOES_NOT_EXIST});
        }
        const isUserValid = await validatePassword(userRecord, password);
        if(isUserValid){
            const token = await generateAccessToken(event);
            return createResponse(200, {"token": token});
        }
        return createResponse(500, INTERNAL_SERVER_ERROR);
    } catch (error) {
        logger.log("index.js", 'login', error.message, "info");
        return createResponse(400, {message:BAD_REQUEST});
    }
};