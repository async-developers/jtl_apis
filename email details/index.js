const axios = require("axios");
const logger = require("logger");

const config = {
    dbUri: process.env.DATABASE_URL || "http://3.111.249.220:8080/api/run-query",
    emailTable: process.env.BOOKING_TABLE_NAME || "email_data"
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

const handler = async (event) => {

    logger.log("fileName", 'Handler invoked', event, "info");

    try{

        const query1 = `select * from email_details where contact_number='0102497013'`;

        const {data} = await dbExecution(query1)
          console.log(data)
        const {pageNumber, limit, filter} = {...event.queryStringParameters};
        const rowsOfPage = parseInt(limit , 10);
        const offsetValue = `${(pageNumber - 1) * rowsOfPage}`;
        
        logger.log("fileName", 'event', `${pageNumber} ${limit} ${filter}`, "info");

        let query; 


        if(filter === "1y"){
            query = `SELECT * FROM ${config.emailTable} WHERE createdAt >= DATEADD(MONTH, -12, GETDATE()) LIMIT ${offsetValue},${rowsOfPage}`
        }
        else if(filter === "6m"){
            query = `SELECT * FROM ${config.emailTable} WHERE createdAt >= DATEADD(MONTH, -6, GETDATE()) LIMIT ${offsetValue},${rowsOfPage}`
        }
        else if(filter === "3m"){
            query = `SELECT * FROM ${config.emailTable} WHERE createdAt >= DATEADD(MONTH, -3, GETDATE()) LIMIT ${offsetValue},${rowsOfPage}`
        }
        else if(filter === "1m"){
            query = `SELECT * FROM ${config.emailTable} WHERE createdAt >= DATEADD(MONTH, -1, GETDATE()) LIMIT ${offsetValue},${rowsOfPage}`
        }
        else{
            query = `SELECT * FROM ${config.emailTable}`
        }
        
        let countQuery = `SELECT COUNT(*) AS total FROM ${config.emailTable}`;
                
        query = `${query} LIMIT ${offsetValue},${rowsOfPage}` 
        
        const dbQuery = `${query};${countQuery}`;

        logger.log("fileName", 'runQuery: Query:-> ', dbQuery, "info");

          const dbResponse = await [query, countQuery].map(statement => dbExecution(statement));
        
        const  [
            { data: emailData },
            {data: [{total: count}]}
          ] = await Promise.all(dbResponse);

        logger.log("fileName", 'emailData:-> ', emailData, "info");
        logger.log("fileName", 'count:-> ', count, "info");
        
        const totalPages = Math.ceil( count/ limit)

        const resp = {
            emailData,
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

handler({})