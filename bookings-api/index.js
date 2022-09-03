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
        const {pageNumber, limit, filter,agentId } = {...event.queryStringParameters};
        const rowsOfPage = parseInt(limit , 10);
        const offsetValue = `${(pageNumber - 1) * rowsOfPage}`;
    
        logger.log("fileName", 'event', `${pageNumber} ${limit} ${filter}`, "info");

        let query; 

        if(filter === "last_six"){
            query = `select * from booking_details inner join agent_booking_mapping on agent_booking_mapping.bookingId = booking_details.id WHERE agent_booking_mapping.agentId=${agentId}  createdAt >= DATEADD(MONTH, -6, GETDATE()) LIMIT ${offsetValue},${rowsOfPage}`
        }
        else if(filter === "last_three"){
            query = `select * from booking_details inner join agent_booking_mapping on agent_booking_mapping.bookingId = booking_details.id WHERE agent_booking_mapping.agentId=${agentId} createdAt >= DATEADD(MONTH, -3, GETDATE()) LIMIT ${offsetValue},${rowsOfPage}`
        }
        else if(filter === "last_one"){
            query = `select * from booking_details inner join agent_booking_mapping on agent_booking_mapping.bookingId = booking_details.id WHERE agent_booking_mapping.agentId=${agentId} createdAt >= DATEADD(MONTH, -1, GETDATE()) LIMIT ${offsetValue},${rowsOfPage}`
        }
        else{
            query = `select * from booking_details inner join agent_booking_mapping on agent_booking_mapping.bookingId = booking_details.id WHERE agent_booking_mapping.agentId=${agentId} LIMIT ${offsetValue},${rowsOfPage}`
        }

        let countQuery = `select * from booking_details inner join agent_booking_mapping on agent_booking_mapping.bookingId = booking_details.id WHERE agent_booking_mapping.agentId=${agentId}`;
        
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
