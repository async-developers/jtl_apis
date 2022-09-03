const AWS = require('aws-sdk');
const axios = require("axios");
const logger = require("logger");

const config = {
    dbUri: process.env.DATABASE_URL || "http://3.111.249.220:8080/api/run-query",
    voucherTable: process.env.VOUCHER_TABLE_NAME || "voucher_details_table",
    BUCKET_NAME: process.env.PRODUCT_IMAGE_BUCKET_NAME
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

const uploadToS3 = async(fileName, fileContent) => {
    logger.log("fileName", 'inside try block', fileName +  " " + typeof fileContent, "info");
    let s3bucket = new AWS.S3({
        Bucket: config.BUCKET_NAME
    });
    
    const params = {
        Bucket: config.BUCKET_NAME,
        Key: `${fileName}.jpg`,
        Body: new Buffer.from(fileContent.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
        ContentType: "image/*"
    };
    
    try{
        logger.log("fileName", 'inside try block', params, "info");
        await s3bucket.putObject(params).promise();
        logger.log("fileName", 'exiting try block', "success", "info");
    }
    catch(err){
        logger.log("fileName", 'error', err, "error");
    }
}

const createQrCodesSqlQuery = (data, productInsertId) => {
  logger.log("fileName", 'createQrCodesSqlQuery', data, "info");
    let insertStatements = '';
    data.forEach((res) => {
      Object.keys(res).forEach((key)  => {
        let keyString = key;
        if (keyString.toLocaleLowerCase() === "Adult Weekends".toLocaleLowerCase()) {
          insertStatements += `('${res[keyString]}', 'Adult', 'mykard', 'Weekends', '0', '0', '${productInsertId}')`
        }
        if (keyString.toLocaleLowerCase() === "Adult Weekdays".toLocaleLowerCase()) {
          insertStatements += `('${res[keyString]}', 'Adult', 'mykard', 'Weekdays', '0', '0', '${productInsertId}' )`
        }
        if (keyString.toLocaleLowerCase() === "Child Weekdays".toLocaleLowerCase()) {
          insertStatements += `('${res[keyString]}', 'Child', 'mykard', 'Weekdays', '0', '0', '${productInsertId}')`
        }
        if (keyString.toLocaleLowerCase() === "Child Weekends".toLocaleLowerCase()) {
          insertStatements += `('${res[keyString]}', 'Child', 'mykard', 'Weekends', '0', '0', '${productInsertId}')`
        }
        if (keyString.toLocaleLowerCase() === "Non Malaysian Adult Weekends".toLocaleLowerCase()) {
          insertStatements += `('${res[keyString]}', 'Adult', 'international', 'Weekends', '0', '0', '${productInsertId}')`
        }
        if (keyString.toLocaleLowerCase() === "Non Malaysian Adult Weekdays".toLocaleLowerCase()) {
          insertStatements += `('${res[keyString]}', 'Adult', 'international', 'Weekdays', '0', '0', '${productInsertId}')`
        }
        if (keyString.toLocaleLowerCase() === "Non Malaysian Child Weekdays".toLocaleLowerCase()) {
          insertStatements += `('${res[keyString]}', 'Child', 'international', 'Weekdays', '0', '0', '${productInsertId}')`
        }
        if (keyString.toLocaleLowerCase() === "Non Malaysian Child Weekends".toLocaleLowerCase()) {
          insertStatements += `('${res[keyString]}', 'Child', 'international', 'Weekends', '0', '0', '${productInsertId}')`
        }
      })
    })

    logger.log("fileName", 'insertIntoStatements', insertStatements, "info");

    const query = `INSERT INTO voucher_details_table (voucher_code, pax_category, origin, sub_category, assignedTo, isProcessed, productId) values ${insertStatements.split(")(").join("),(")}`;

    return query;

}


const createQrCodesSamePriceSqlQuery = (data, productInsertId) => {
  logger.log("fileName", 'createQrCodesSqlQuery', data, "info");
  let insertStatements = '';
  data.forEach((res) => {
    Object.keys(res).forEach((key)  => {
      let keyString = key;
      if (keyString.toLocaleLowerCase() === "Adult".toLocaleLowerCase()) {
        insertStatements += `('${res[keyString]}', 'Adult', 'mykard', 'all', '0', '0', '${productInsertId}')`
      }
      if (keyString.toLocaleLowerCase() === "Child".toLocaleLowerCase()) {
        insertStatements += `('${res[keyString]}', 'Child', 'mykard', 'all', '0', '0', '${productInsertId}')`
      }
      if (keyString.toLocaleLowerCase() === "Non Malaysian Adult".toLocaleLowerCase()) {
        insertStatements += `('${res[keyString]}', 'Adult', 'international', 'all', '0', '0', '${productInsertId}')`
      }
      if (keyString.toLocaleLowerCase() === "Non Malaysian Child".toLocaleLowerCase()) {
        insertStatements += `('${res[keyString]}', 'Child', 'international', 'all', '0', '0', '${productInsertId}')`
      }
    })
  })

  const query = `INSERT INTO voucher_details_table (voucher_code, pax_category, origin, sub_category, assignedTo, isProcessed, productId) values ${insertStatements.split(")(").join("),(")}`;

  logger.log("fileName", 'insertIntoStatements', insertStatements, "info");

  return query;

}


exports.handler = async (event) => {

    logger.log("fileName", 'Handler invoked', event, "info");
    
    try{
        const body = JSON.parse(event.body);
        
        logger.log("fileName", 'event', body, "info");

        const productName = body.productName;
        const subcomponents = body.subcomponents;
        const productImage = body.productImage;
        const isSamePriceCheckTrue = body.isSamePriceCheckTrue;
        const qrCodesData = body.qrCodesData;

        const fileName = `${productName}-${Date.now()}`
        await uploadToS3(fileName, productImage);

        const insertProductStatement = `insert into products_list_table (product_name, product_image, samePriceAllDay) value ('${productName}', '${fileName}', ${isSamePriceCheckTrue})`;
        const {data: {insertId: productInsertId}} = await dbExecution(insertProductStatement);
        logger.log(`inserted record id ${productInsertId}`);

        let subComponentsQuery = "";
        let qrCodeQuery;

        if(isSamePriceCheckTrue){
            subcomponents.map(item => {
                const data = `('${item.productName}', '${item.adultPrice}', '${item.adultPrice}', '${item.adultLimit}', '${item.childPrice}', '${item.childPrice}', '${item.childLimit}', '${productInsertId}', '${item.isMalaysian}')`
                subComponentsQuery += (subComponentsQuery === "") ? data : `, ${data}`;
            })
            qrCodeQuery = createQrCodesSamePriceSqlQuery(qrCodesData, productInsertId);            
        }
        else{
            subcomponents.map(item => {
                const data = `('${item.productName}', '${item.wdAdultPrice}', '${item.weAdultPrice}', '${item.adultLimit}', '${item.wdChildPrice}', '${item.weChildPrice}', '${item.childLimit}', '${productInsertId}', '${item.isMalaysian}')`
                subComponentsQuery += (subComponentsQuery === "") ? data : `, ${data}`;
            })
            qrCodeQuery = createQrCodesSqlQuery(qrCodesData, productInsertId);
        }

        const insertSubComponentsQuery =`insert into products_components_table (component_name, wdAdPrice, weAdPrice, adLimit, wdChPrice, weChPrice, chLimit, productId, applicableOnLocals) values ${subComponentsQuery}`;
        
        const dbResponse = await [insertSubComponentsQuery, qrCodeQuery].map(statement => dbExecution(statement));
        
        await Promise.all(dbResponse);
        
        return createResponse(200, {productRecordId: productInsertId});
    }
    catch(err){
        logger.log("fileName", 'handler', err.message, "error");
        return createResponse(400, err.message)
    }
}
