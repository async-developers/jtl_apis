const axios = require("axios");
const logger = require("logger");
const QRCode = require('qrcode')

const config = {
    dbUri: process.env.DATABASE_URL || "http://3.111.249.220:8080/api/run-query",
    emailTable: process.env.VOUCHER_TABLE_NAME || "email_details"
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
        const qr = await QRCode.toDataURL(code)
        return({
            voucherCode: code,
            qrImage: qr
        })
    })
}

const handler = async (event) => {

    logger.log("fileName", 'Handler invoked', event, "info");

    try{
        const { id } = {...event.queryStringParameters};
        
        // const query = `SELECT * FROM ${config.emailTable} where id =${id}`;
        
        const query = `INSERT INTO email_details (customer_name, product_name, email_id, adult_count, child_count, contact_number, book_date, adult_qr_code) value ('text', 'MyKad Holder', 'thetechgeek2020@gmail.com', 1,1, '1212112221', '2020-04-19T18:30:00.000Z','XQQQQQ121331, ABC1212121221' );`

        logger.log("fileName", 'runQuery: Query:-> ', `${query}` , "info");

        const dbResponse = await dbExecution(query);

        const {data : [dbData]} = {...dbResponse}

        const {adult_count, adult_qr_code, 
            book_date,
            child_count,
            child_qr_code, 
            contact_number,
            customer_name,
            email_id,
            is_email_triggered,
            product_name } = {...dbData} 

           
            
        if(adult_count > 0 && child_count > 0){
            
            const adult_Voucher_Code = adult_qr_code.split(",")
            const child_Voucher_Code = child_qr_code.split(",")

            logger.log("fileName", 'bookingData:-> ', adult_Voucher_Code, "info");
            logger.log("fileName", 'bookingData:-> ', child_Voucher_Code, "info");
            
            const adultQrAwait = await generateQrCode(adult_Voucher_Code);
            const adultQr = await Promise.all(adultQrAwait);
            
            const childQrAwait = await generateQrCode(child_Voucher_Code);
            const childQr = await Promise.all(childQrAwait);

            logger.log("fileName", 'bookingData:-> ', adultQr, "info");
            logger.log("fileName", 'bookingData:-> ', childQr, "info");
            
            const resp = {
                date: book_date,
                cardEmail: email_id,
                customerName: customer_name,
                productName: product_name,
                adultQrArr: adultQr,
                childQrArr: childQr
            }
            await axios.post(`http://3.111.249.220:8081/api/send-email`, {
                dataArray: resp,
                cardName: customer_name,
                productName: product_name,
                cardEmail: email_id,
                date: new Date(book_date).toString().substring(4, 15),
                adultCount: adult_count,
                childCount: child_count,
                contactNumber: contact_number
              });
        }
        else if(adult_count > 0 && child_count < 1){

            const adult_Voucher_Code = adult_qr_code.split(",")

            logger.log("fileName", 'bookingData:-> ', adult_Voucher_Code, "info");
            
            const adultQrAwait = await generateQrCode(adult_Voucher_Code);
            const adultQr = await Promise.all(adultQrAwait);

            logger.log("fileName", 'bookingData:-> ', adultQr, "info");

            const resp = {
                date: book_date,
                cardEmail: email_id,
                customerName: customer_name,
                productName: product_name,
                adultQrArr: adultQr,
                childQrArr: []
            }
            // return createResponse(200, resp);
            return await axios.post(`http://3.111.249.220:8081/api/send-email`, {
                dataArray: resp,
                cardName: customer_name,
                productName: product_name,
                cardEmail: email_id,
                date: new Date(book_date).toString().substring(4, 15),
                adultCount: adult_count,
                childCount: child_count,
                contactNumber: contact_number
            });
        }
        else{

            const child_Voucher_Code = child_qr_code.split(",")

            logger.log("fileName", 'bookingData:-> ', child_Voucher_Code, "info");
            
            const childQrAwait = await generateQrCode(child_Voucher_Code);
            const childQr = await Promise.all(childQrAwait);

            logger.log("fileName", 'bookingData:-> ', childQr, "info");

            const resp = {
                date: book_date,
                cardEmail: email_id,
                customerName: customer_name,
                productName: product_name,
                adultQrArr: [],
                childQrArr: childQr
            }
            return await axios.post(`http://3.111.249.220:8081/api/send-email`, {
                dataArray: resp,
                cardName: customer_name,
                productName: product_name,
                cardEmail: email_id,
                date: new Date(book_date).toString().substring(4, 15),
                adultCount: adult_count,
                childCount: child_count,
                contactNumber: contact_number
            });
        }

        const updateQuery = `update email_details set is_email_triggered = true`;
        await dbExecution(updateQuery);
    }
    catch(err){
        logger.log("fileName", 'handler', err.message, "error");
        return createResponse(400, err.message)
    }
}

handler({
    queryStringParameters:{
        id:1
    }
})