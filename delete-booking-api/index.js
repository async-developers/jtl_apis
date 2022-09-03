const axios = require("axios");
const logger = require("logger");

const config = {
    dbUri: process.env.DATABASE_URL || "http://54.221.176.157:8080/api/run-query",
    bookingTable: process.env.BOOKING_TABLE_NAME || "booking_details",
    vouchers_details_table: process.env.VOUCHER_DETAILS_TABLE || "voucher_details_table"
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
        const bookingDetails = JSON.parse(event.body);

        const vouchers = bookingDetails.voucherCodes.split(",");
        const bookingId = bookingDetails.bookingId;

        const vouchersString = "'" + vouchers.join("','") + "'";

        
        logger.log("fileName", 'payload', `${vouchersString} ${bookingId}`, "info");

        let vouchersQuery= `update ${config.vouchers_details_table} set assignedTo = 0 where voucher_code in (${vouchersString})`;
        let bookingQuery = `delete from ${config.bookingTable} where id=${bookingId}`;

        const dbResponse = [vouchersQuery, bookingQuery].map(statement => dbExecution(statement));
        
        await Promise.all(dbResponse);

        return createResponse(200, "Deleted Booking details");
    }
    catch(err){
        logger.log("fileName", 'handler', err.message, "error");
        return createResponse(400, err.message)
    }
}
