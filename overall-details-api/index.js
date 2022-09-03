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
        const totalUsersQuery = "SELECT COUNT(DISTINCT email_id) AS totalUsers FROM booking_details;"
        const sumAmountQuery = 'SELECT SUM(amount) as sum_amount FROM booking_details where payment_status = "Completed";'
        const pendingTransactionsQuery = 'SELECT SUM(amount) as pending_amount FROM booking_details where payment_status = "requires_payment_method";'
        const failedTransactionQuery = 'SELECT SUM(amount) as failed_amount FROM booking_details where payment_status = "failed";'
        const totalBookingsQuery = "SELECT COUNT(*) AS count FROM booking_details;"

        const adultWeekdaysQuery = 'select COUNT(*) as adultWdQr from voucher_details_table where pax_category = "ADULT" and sub_category = "Weekdays";'
        const adultWeekendsQuery = 'select COUNT(*) as adultWeQr from voucher_details_table where pax_category = "ADULT" and sub_category = "Weekends";'
        const childWeekendsQuery = 'select COUNT(*) as childWeQr from voucher_details_table where pax_category = "CHILD" and sub_category = "Weekends";'
        const childWeekdaysQuery = 'select COUNT(*) as childWdQr from voucher_details_table where pax_category = "CHILD" and sub_category = "Weekdays";'
        
        const dbResponse = await [totalUsersQuery, sumAmountQuery, pendingTransactionsQuery, failedTransactionQuery, totalBookingsQuery, adultWeekdaysQuery, adultWeekendsQuery, childWeekdaysQuery, childWeekendsQuery]
        .map(statement => dbExecution(statement));
        
        const  [
            {data: [{totalUsers: users }]},
            {data: [{sum_amount: earnings}]},
            {data: [{pending_amount: pendingAmount}]},
            {data: [{failed_amount: failedAmount}]},
            {data: [{count: bookingCount}]},
            {data: [{adultWdQr}]},
            {data: [{adultWeQr}]},
            {data: [{childWeQr}]},
            {data: [{childWdQr}]},
          ] = await Promise.all(dbResponse);

        logger.log("fileName", 'users:-> ', users , "info");
        logger.log("fileName", 'earning:-> ', earnings , "info");
        logger.log("fileName", 'pendingCount:-> ', pendingAmount , "info");
        logger.log("fileName", 'failedCount:-> ', failedAmount , "info");
        logger.log("fileName", 'bookingCount:-> ', bookingCount , "info");
        logger.log("fileName", 'adult weekdays Qr count:-> ', adultWdQr , "info");
        logger.log("fileName", 'adult weekends Qr count:-> ', adultWeQr , "info");
        logger.log("fileName", 'child weekends Qr count:-> ', childWeQr , "info");
        logger.log("fileName", 'child weekdays Qr count:-> ', childWdQr , "info");
    

        const response = {
            upperTiles: [
                {
                    name: "users",
                    value: users || 0,
                    icon: "fa fa-users"
                },
                
                {
                    name: "Total Bookings",
                    value: bookingCount || 0,
                    icon: "fa fa-map-marker"
                },
            
                {
                    name: "Earnings",
                    value: earnings || 0,
                    icon: "fa fa-money"
                },
            
                {
                    name: "pending payments",
                    value: pendingAmount || 0,
                    icon: "fa fa-money"
                },
                
                {
                    name: "failed payments",
                    value: failedAmount || 0,
                    icon: "fa fa-money"
                }
            ],
            middleTiles: [
                {
                    name: "Available Adult Weekdays QR code",
                    value: adultWdQr || 0,
                    icon: "fa fa-money"
                },

                {
                    name: "Available Adult Weekends QR code",
                    value: adultWeQr || 0,
                    icon: "fa fa-money"
                },
                
                {
                    name: "Available child Weekdays QR code",
                    value: childWdQr || 0,
                    icon: "fa fa-money"
                },

                {
                    name: "Available Child Weekends QR code",
                    value: childWeQr || 0,
                    icon: "fa fa-money"
                },
            ]
        }
        
        logger.log("fileName", 'response', response, "info");
        return createResponse(200, response);
    }
    catch(err){
        logger.log("fileName", 'handler', err.message, "error");
        return createResponse(400, err.message)
    }
}