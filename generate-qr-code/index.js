const axios = require("axios");
const logger = require("logger");
const QRCode = require('qrcode')

const config = {
    dbUri: process.env.DATABASE_URL || "http://54.221.176.157:8080/api/run-query",
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
     
    if(dt.getDay() == 6 || dt.getDay() == 0){
        return "Weekends";
    } 
    else{
        return "Weekdays"
    }
}

const generateQrCode = async (vouchers) => {
    return await vouchers.map(async code => {
        return await QRCode.toDataURL(code.voucher_code);
    })
}

exports.handler = async (event) => {

    logger.log("fileName", 'Handler invoked', event, "info");
    
    try{
        const { date, adultCount, childCount, customerName, productName } = {...event.queryStringParameters};
        
        const day = dayType(date);

        logger.log("fileName", 'event', `${adultCount} ${childCount} ${day}`, "info");

        let adultQuery = "";

        let childQuery = "";

        let query = [];

        if(adultCount > 0){
            
            adultQuery = `SELECT voucher_code FROM ${config.voucherTable} where isProcessed = 0 AND assignedTo = 0 AND pax_category = 'Adult' AND sub_category = '${day}' LIMIT 0,${adultCount};` 

        }

        if(childCount > 0){

            childQuery = `SELECT voucher_code FROM ${config.voucherTable} where isProcessed = 0 AND assignedTo = 0 AND pax_category = 'Child' AND sub_category = '${day}' LIMIT 0,${childCount};` 
        
        }

        logger.log("fileName", 'runQuery: Query:-> ', `${adultQuery} ${childQuery}` , "info");

        if(adultQuery !== ""){
            query.push(adultQuery)
        }

        if(childQuery !== ""){
            query.push(childQuery)
        }
        
        logger.log("fileName", 'runQuery: Query:-> ', query, "info");

        const dbResponse = await query.map(statement => dbExecution(statement));

        if(adultCount > 0 && childCount > 0){
            const  [
                {data: adult_Voucher_Code},
                {data: child_Voucher_Code}
            ] = await Promise.all(dbResponse);
            
            logger.log("fileName", 'bookingData:-> ', adult_Voucher_Code, "info");
            logger.log("fileName", 'bookingData:-> ', child_Voucher_Code, "info");
            
            const adultQrAwait = await generateQrCode(adult_Voucher_Code);
            const adultQr = await Promise.all(adultQrAwait);
            
            const childQrAwait = await generateQrCode(child_Voucher_Code);
            const childQr = await Promise.all(childQrAwait);

            logger.log("fileName", 'bookingData:-> ', adultQr, "info");
            logger.log("fileName", 'bookingData:-> ', childQr, "info");
            
            const resp = {
                customerName,
                productName,
                adultQrArr: adultQr,
                childQrArr: childQr
            }
            return createResponse(200, resp);

        }
        else if(adultCount > 0 && childCount < 1){
            const  [
                {data: adult_Voucher_Code}
            ] = await Promise.all(dbResponse);
            
            logger.log("fileName", 'bookingData:-> ', adult_Voucher_Code, "info");
            
            const adultQrAwait = await generateQrCode(adult_Voucher_Code);
            const adultQr = await Promise.all(adultQrAwait);

            logger.log("fileName", 'bookingData:-> ', adultQr, "info");

            const resp = {
                customerName,
                productName,
                adultQrArr: adultQr,
                childQrArr: []
            }
            return createResponse(200, resp);
        }
        else{
            const  [
                {data: child_Voucher_Code}
            ] = await Promise.all(dbResponse);
            
            logger.log("fileName", 'bookingData:-> ', child_Voucher_Code, "info");
            
            const childQrAwait = await generateQrCode(child_Voucher_Code);
            const childQr = await Promise.all(childQrAwait);

            logger.log("fileName", 'bookingData:-> ', childQr, "info");

            const resp = {
                customerName,
                productName,
                adultQrArr: [],
                childQrArr: childQr
            }
            return createResponse(200, resp);
        }
    }
    catch(err){
        logger.log("fileName", 'handler', err.message, "error");
        return createResponse(400, err.message)
    }
}
