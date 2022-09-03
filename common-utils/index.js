const axios = require("axios");
const logger = require("logger");
const path = require('path');

const fileName = path.basename(__filename);

const createResponse = (statusCode, body, message = null, successResult = null) => {
    const bodyResponse = (successResult !== null) ? {
      success: successResult, statusCode, message, data: body
    } : body;
    const response = {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'token, authenticationkey',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
      },
      body: JSON.stringify(bodyResponse),
      isBase64Encoded: false
    };
  
    logger.log(fileName, 'createResponse: creating response', response, logConstants.INFO);
    return response;
  };
  

  const runQuery = async (query) => {
    try {
      const response = await axios({
        method: 'post',
        url: databaseUri,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          query
        }
      });
      logger.log(fileName, 'runQuery: data base execution passed. Query:-> ', query, logConstants.INFO);
      return response;
    } catch (err) {
      logger.log(fileName, 'runQuery: data base request failed!', err.message, logConstants.ERROR);
    }
  };
  
  module.exports ={
      createResponse,
      runQuery
  }