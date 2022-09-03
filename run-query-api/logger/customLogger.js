'use strict';

const logConstants = require('./loggerConstants');

let uuid = '';
function init(id) {
  uuid = id;
}

function getLogEvent(eventType) {
  return logConstants.LOG_HASH_OBJECT[eventType] ?
    logConstants.LOG_HASH_OBJECT[eventType] :
    logConstants.LOG_HASH_OBJECT.debug;
}

function getUpperCaseLogLevel(logVal) {
  return logVal ? logVal.toUpperCase() : '';
}

function printLog(logVal, logData, envDebugVal) {
  /**
   * if debugVal is debug show all logs
   * if debugVal is info show info,warn,err logs
   * if debugVal is warn show warn,err logs
   * if debugVal is err show err logs
   */
  const evt = getLogEvent(logVal);
  const debugValPriority = evt.priority;
  const envDebugValPriority = logConstants.LOG_HASH_OBJECT[envDebugVal] ?
    logConstants.LOG_HASH_OBJECT[envDebugVal].priority :
    logConstants.LOG_HASH_OBJECT.debug.priority;
  const logLevel = getUpperCaseLogLevel(logVal);
  if (debugValPriority <= envDebugValPriority) {
    console.log(uuid ? `[${logLevel}] ${uuid}:` : `[${logLevel}] `, logData);
  }
}

function log(callingFunc, logMessage, data, logVal) {
  const logData = `${callingFunc} :: ${logMessage} :: ${JSON.stringify(data)}`;
  printLog(logVal, logData, process.env.debugValue);
}

function logEvent(callingFunc, event, logVal) {
  const logData = `${callingFunc} - Request body:: ${JSON.stringify(event.body)} \n${callingFunc} - Request headers:: ${JSON.stringify(event.headers)}`;
  printLog(logVal, logData, process.env.debugValue);
}

function logString(callingFunc, stringData, logVal) {
  const logData = `${callingFunc} :: ${stringData}`;
  printLog(logVal, logData, process.env.debugValue);
}

module.exports = {
  log,
  logEvent,
  logString,
  init,
  printLog
};
