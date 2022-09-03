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


exports.handler = async () => {

    logger.log("fileName", 'Handler invoked', "", "info");
    
    try{
        const yearQuery = "SELECT * FROM booking_details WHERE  date_format(createdAt, '%Y-01-01') between  DATE_FORMAT(CURDATE() ,'%Y-01-01') AND CURDATE() AND payment_status ='completed';"
        const monthQuery = "SELECT * FROM booking_details WHERE  date_format(createdAt, '%Y-%m-01') between  DATE_FORMAT(CURDATE() ,'%Y-%m-01') AND CURDATE()  AND payment_status ='completed';"
        const weekQuery = "SELECT * FROM booking_details WHERE WEEKOFYEAR(createdAt)=WEEKOFYEAR(CURDATE())  AND payment_status ='completed';"
        
        const dbResponse = await [yearQuery, monthQuery, weekQuery]
                    .map(statement => dbExecution(statement));
        
        const  [
            {data: yearData},
            {data: monthData},
            {data: weekData}
          ] = await Promise.all(dbResponse);

        logger.log("fileName", 'adult weekends Qr count:-> ', yearData , "info");
        logger.log("fileName", 'child weekends Qr count:-> ', monthData , "info");
        logger.log("fileName", 'child weekdays Qr count:-> ', weekData , "info");
    
        const monthlyDataForYear = new Array(12).fill(0); 
        yearData.forEach(({ createdAt }) => monthlyDataForYear[new Date(createdAt).getMonth()] += 1);
        
        const monthlySalesForYear = new Array(12).fill(0); 
        yearData.forEach((item) => monthlySalesForYear[new Date(item.createdAt).getMonth()] += item.amount);

        const resp = {
            yearly: {
                perMonthData: monthlyDataForYear,
                perMonthTotal: monthlySalesForYear
            }
        }
        return createResponse( 200, resp)
    }
    catch(err){
        logger.log("fileName", 'handler', err.message, "error");
        return createResponse(400, err.message)
    }
}
