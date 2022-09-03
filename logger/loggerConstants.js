'use strict';

/**
 * PODAR ATOM
 * Copyright (c) 2020 PODAR
 * All Rights Reserved Worldwide
 * Proprietary and Confidential - Not for Distribution
 * Written by Altran
 */
const LOG_HASH_OBJECT = {
  debug: {
    type: 'debug',
    priority: 4
  },
  info: {
    type: 'info',
    priority: 3
  },
  warn: {
    type: 'warn',
    priority: 2
  },
  error: {
    type: 'error',
    priority: 1
  }
};


const DEBUG = LOG_HASH_OBJECT.debug.type;
const INFO = LOG_HASH_OBJECT.info.type;
const ERROR = LOG_HASH_OBJECT.error.type;
const WARNING = LOG_HASH_OBJECT.warn.type;

module.exports = {
  LOG_HASH_OBJECT, DEBUG, INFO, ERROR, WARNING
};
