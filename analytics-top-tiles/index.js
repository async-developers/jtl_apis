const axios = require('axios');
const logger = require('../logger/customLogger')

const createResponse = (statusCode, body, message = null, successResult = null) => {
  const bodyResponse = (successResult !== null) ? {
    success: successResult, statusCode, message, data: body
  } : body;
  const response = {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'token, authenticationkey',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
    },
    body: JSON.stringify(bodyResponse),
    isBase64Encoded: false
  };

  logger.log(fileName, 'createResponse: creating response', response, logConstants.INFO);
  return response;
};


const createTilesArray = (data) => {
//   {
//     name: "Users",
//     value: 800,
//     subtitle: "Overall Bookings",
//     icon: "fa fa-map-marker"
// },
let [ [{totalUsers: userCount}], [{sum_amount: amount}], [{pendingCount}]] = [...data]
const tilesList = [
  {
      name: "users",
      value: userCount,
      subtitle: "QR codes attached with tickets",
      icon: "fa fa-map-marker"
  },

  {
      name: "Available Adult QR Codes",
      value: 200,
      subtitle: "Available",
      icon: "fa fa-map-marker"
  },

  {
      name: "Available Child QR Codes",
      value: 200,
      subtitle: "Not in use",
      icon: "fa fa-map-marker"
  },

  {
      name: "Total QR Codes",
      value: 200,
      subtitle: "Not in use",
      icon: "fa fa-map-marker"
  }
]
}

exports.handler = async() => {
  try{
    logger.log(fileName, 'Analytics Top Tiles: AnalyticsTopTiles handler invoked', " ", logConstants.INFO);
    
    const totalUsersQuery = "SELECT COUNT(DISTINCT email_id) AS totalUsers FROM booking_details;"
    const sumAmountQuery = "SELECT SUM(amount) as sum_amount FROM booking_details;"
    const pendingPaymentsCount = "SELECT COUNT(DISTINCT customer_name) AS pendingCount FROM booking_details where payment_status = 'required_payment_method';"
    const failedPaymentsCount = "SELECT COUNT(DISTINCT customer_name) AS pendingCount FROM booking_details where payment_status = 'failed';"
    const data = await axios.post('http://54.221.176.157:8080/api/run-query', {
      query: `${totalUsersQuery}${sumAmountQuery}${pendingPaymentsCount}`
    });
    return createResponse(200, data[0]);
  }
  catch(err){
    return createResponse(400, []);
  }
}