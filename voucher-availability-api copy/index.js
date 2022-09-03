const axios = require("axios");
const logger = require("logger");

const config = {
    dbUri: process.env.DATABASE_URL || "http://3.111.249.220:8080/api/run-query",
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

const dayType = (date1) => {
    let dt = new Date(date1);
     console.log(dt, dt.getDay())
    if(dt.getDay() == 6 || dt.getDay() == 0){
        return "Weekends";
    } 
    else{
        return "Weekdays"
    }
}

const handler = async (event) => {

    logger.log("fileName", 'Handler invoked', event, "info");
    
    try{
        const body = JSON.parse(event.body);
        
        logger.log("fileName", 'event', body, "info");

        // {
        //     "productName": "",
        //     "subcomponents": [
        //             { "productName": "", "wdAdultPrice": "", "weAdultPrice": "", "adultLimit": "", "wdChildPrice": "", "weChildPrice": "", "childLimit": "" },
        //             { "productName": "", "wdAdultPrice": "", "weAdultPrice": "", "adultLimit": "", "wdChildPrice": "", "weChildPrice": "", "childLimit": "" },
        //             { "productName": "", "wdAdultPrice": "", "weAdultPrice": "", "adultLimit": "", "wdChildPrice": "", "weChildPrice": "", "childLimit": "" },
        //             { "productName": "", "wdAdultPrice": "", "weAdultPrice": "", "adultLimit": "", "wdChildPrice": "", "weChildPrice": "", "childLimit": "" },
        //             { "productName": "", "wdAdultPrice": "", "weAdultPrice": "", "adultLimit": "", "wdChildPrice": "", "weChildPrice": "", "childLimit": "" },
        //             { "productName": "", "wdAdultPrice": "", "weAdultPrice": "", "adultLimit": "", "wdChildPrice": "", "weChildPrice": "", "childLimit": "" },
        //             { "productName": "", "wdAdultPrice": "", "weAdultPrice": "", "adultLimit": "", "wdChildPrice": "", "weChildPrice": "", "childLimit": "" }
        //     ]
        // }

        const productName = body.productName;
        const subcomponents = body.subcomponents;

        const insertProductStatement = `insert into products_list_table (product_name) value ('${productName}')`;
        const {data: {insertId: productInsertId}} = await dbExecution(insertProductStatement);
        logger.log(`inserted record id ${productInsertId}`);

        let subComponentsQuery = "";

        subcomponents.map(item => {
            const data = `('${item.productName}', '${item.wdAdultPrice}', '${item.weAdultPrice}', '${item.adultLimit}', '${item.wdChildPrice}', '${item.weChildPrice}', '${item.childLimit}', '${productInsertId}')`
            subComponentsQuery += (subComponentsQuery === "") ? data : `, ${data}`;
        })

        const insertSubComponentsQuery =`insert into products_components_table (component_name, wdAdPrice, weAdPrice, adLimit, wdChPrice, weChPrice, chLimit, productId) values ${subComponentsQuery}`;
        const {data: {insertId: componentInsertId}} =   await dbExecution(insertSubComponentsQuery);
        
        return createResponse(200, {insertedId: componentInsertId});
    }
    catch(err){
        logger.log("fileName", 'handler', err.message, "error");
        return createResponse(400, err.message)
    }
}


const data = {
    body: JSON.stringify(
                {
            "productName": "test",
            "subcomponents": [
                    { "productName": "test", "wdAdultPrice": "12", "weAdultPrice": "11", "adultLimit": "1", "wdChildPrice": "22", "weChildPrice": "2", "childLimit": "3" }
            ]
        }
    )
}

handler(data)