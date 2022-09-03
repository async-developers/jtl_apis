const axios = require("axios");
const logger = require("logger");

const config = {
    dbUri: process.env.DATABASE_URL || "http://54.221.176.157:8080/api/run-query",
    bookingTable: process.env.BOOKING_TABLE_NAME || "booking_details"
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
        const {pageNumber, limit, filter, type, gw, productId} = {...event.queryStringParameters};
        const rowsOfPage = parseInt(limit , 10);
        const offsetValue = `${(pageNumber - 1) * rowsOfPage}`;
        
        logger.log("fileName", 'event', `${pageNumber} ${limit} ${filter} ${type} ${gw}`, "info");

        let query; 

        if(filter === "1y"){
            query = `SELECT * FROM ${config.bookingTable} WHERE createdAt > now() - INTERVAL 12 MONTH `
        }
        else if(filter === "6m"){
            query = `SELECT * FROM ${config.bookingTable} WHERE createdAt > now() - INTERVAL 6 MONTH `
        }
        else if(filter === "3m"){
            query = `SELECT * FROM ${config.bookingTable} WHERE createdAt > now() - INTERVAL 3 MONTH `
        }
        else if(filter === "1m"){
            query = `SELECT * FROM ${config.bookingTable} WHERE createdAt > now() - INTERVAL 1 MONTH `
        }
        else{
            query = `SELECT * FROM ${config.bookingTable} `
        }
        
        let countQuery = `SELECT COUNT(*) AS total FROM ${config.bookingTable}`;
        
        
        if(type !== undefined){
            
            if(filter === "all"){
                query += " where"
            }
            else{
                query += " and "
            }
            
            if(type === "success"){
                query = query + " payment_status = 'Completed' "
                countQuery = countQuery + " where payment_status = 'Completed' "
            }
            if(type === "failed"){
                query = query + " payment_status = 'Failed' "
                countQuery = countQuery + " where payment_status = 'Failed' "
            }
            if(type === "pending"){
                query = query + " payment_status = 'requires_payment_method' "
                countQuery = countQuery + " where payment_status = 'requires_payment_method' "
            }
        }
        
        if(gw === "manual"){
            query = query + " or payment_status = 'Manual Booking' and payment_gateway = 'Manual Booking' "
            countQuery = countQuery + " or payment_status = 'Manual Booking'  and payment_gateway = 'Manual Booking' "
        }
        else if(gw === "stripe"){
            query = query + " or payment_gateway = 'STRIPE' or payment_gateway = 'FPX' "
            countQuery = countQuery +  " or payment_gateway = 'STRIPE' or payment_gateway = 'FPX' "
        }
        
        
        query = query + ` And productId = ${productId} ORDER BY createdAt DESC LIMIT ${offsetValue},${rowsOfPage}`
        countQuery = countQuery + ` And productId = ${productId}`
        const dbQuery = `${query};${countQuery}`;

        logger.log("fileName", 'runQuery: Query:-> ', dbQuery, "info");

        const dbResponse = await [query, countQuery].map(statement => dbExecution(statement));
        
        const  [
            { data: bookingData },
            {data: [{total: count}]}
          ] = await Promise.all(dbResponse);

        logger.log("fileName", 'bookingData:-> ', bookingData, "info");
        logger.log("fileName", 'count:-> ', count, "info");
        
        const totalPages = Math.ceil( count/ limit)

        const resp = {
            bookingData,
            pagination: {
            currentPage: parseInt(pageNumber,10),
            totalPages: parseInt(totalPages, 10),
            perPage: parseInt(limit, 10),
            count
          }
        }
        return createResponse(200, resp);
    }
    catch(err){
        logger.log("fileName", 'handler', err.message, "error");
        return createResponse(400, err.message)
    }
}
