const axios = require("axios");
const logger = require("logger");

const config = {
    dbUri: process.env.DATABASE_URL || "http://3.111.249.220:8080/api/run-query",
    voucherTable: process.env.VOUCHER_TABLE_NAME || "voucher_details_table"
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

const dayType = (date1) => {
    let dt = new Date(date1);
     console.log(dt, dt.getDay())
    if(dt.getDay() == 6 || dt.getDay() == 0){
        return "Weekends";
    } 
    else{
        return "Weekdays"
    }
}

exports.handler = async (event) => {

    logger.log("fileName", 'Handler invoked', event, "info");
    
    try{
        const {date } = {...event.queryStringParameters};
        
        logger.log("fileName", 'event', date, "info");

        const isWeekend = dayType(decodeURIComponent(date));

        let queryOne = `SELECT COUNT(*) as adultCount from ${config.voucherTable} WHERE sub_category = '${isWeekend}' AND pax_category = 'Adult'`;
        let queryTwo = `SELECT COUNT(*) as childCount from ${config.voucherTable} WHERE sub_category = '${isWeekend}' AND pax_category = 'Child'`;
         
        const dbResponse = await [queryOne, queryTwo].map(statement => dbExecution(statement));
        
        const  [
            {data: [{ adultCount}]},
            {data: [{childCount}]}
          ] = await Promise.all(dbResponse);

        
        
        const resp = {
            adultCount: parseInt(adultCount, 10) || 0,
            childCount: parseInt(childCount, 10) || 0
        }
        return createResponse(200, resp);
    }
    catch(err){
        logger.log("fileName", 'handler', err.message, "error");
        return createResponse(400, err.message)
    }
}