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


const monthName = (monthNumber) => {
    const months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];

    return months[monthNumber - 1];
}


exports.handler = async () => {

    logger.log("fileName", 'Handler invoked', "", "info");
    
    try{
        const salesQuery = '	select year(createdAt),month(createdAt),day(createdAt),sum(amount) from booking_details group by year(createdAt),month(createdAt), day(createdAt) order by year(createdAt),month(createdAt), day(createdAt);'
        const categoryQuery = 'select product_name, count(product_name) as NumberOfRowsPerName from booking_details group by product_name';
        const dbResponse = await [salesQuery, categoryQuery].map(statement =>  dbExecution(statement))
        
        const [{data}, {data: data2}] = await Promise.all(dbResponse)
        // const {data} = {...dbResponse};

        logger.log("fileName", 'child weekdays Qr count:-> ', data , "info");
        logger.log("fileName", 'attractions analytics:-> ', data2 , "info");

        const updateDataSet = data.map(item => {
            return ({
                year: item["year(createdAt)"],
                month: monthName(item["month(createdAt)"]),
                day: item["day(createdAt)"],
                sales: item["sum(amount)"]
            })
        })
        logger.log("fileName", 'child weekdays Qr count:-> ', updateDataSet , "info");

        const response = {
            salesData: updateDataSet,
            categoryData: data2
        }
    
       return createResponse(200, response);
    }
    catch(err){
        logger.log("fileName", 'handler', err.message, "error");
        return createResponse(400, err.message)
    }
}