'use strict';

/**
 * PODAR ATOM PLATFORM
 * Copyright (c) 2016 PODAR
 * All Rights Reserved Worldwide
 * Proprietary and Confidential - Not for Distribution
 * Written by Aricent
 * AUTHOR IDENTITY:
 * Atom Team 24/12/2020
 */
const assert = require('assert');
const sinon = require('sinon');
const customLogger = require('logger/customLogger.js');
const logConstants = require('logger/loggerConstants.js');

const callingFunc = 'callingFunc';
const logMessage = 'logMessage';
const data = 'data';
let logVal = logConstants.DEBUG;
let event;
let printLogSpy;

describe('logger test cases with process env value as debug', () => {
  beforeEach(() => {
    process.env.debugValue = logConstants.DEBUG;
    printLogSpy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    printLogSpy.restore();
  });

  describe('calling log function', () => {
    it('Test case with log method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
  });

  describe('calling logString function', () => {
    it('Test case with logString method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
  });

  describe('calling logEvent function', () => {
    before(() => {
      event = {
        body: 'event_body',
        headers: 'event_header'
      };
    });

    it('Test case with logEvent method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
  });
});

describe('logger test cases with process env value as info', () => {
  beforeEach(() => {
    process.env.debugValue = logConstants.INFO;
    printLogSpy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    printLogSpy.restore();
  });

  describe('calling log function', () => {
    it('Test case with log method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
    it('Test case with log method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
  });

  describe('calling logString function', () => {
    it('Test case with logString method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
    it('Test case with logString method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
  });

  describe('calling logEvent function', () => {
    before(() => {
      event = {
        body: 'event_body',
        headers: 'event_header'
      };
    });

    it('Test case with logEvent method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });

    it('Test case with logEvent method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
  });
});

describe('logger test cases with process env value as warning', () => {
  beforeEach(() => {
    process.env.debugValue = logConstants.WARNING;
    printLogSpy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    printLogSpy.restore();
  });

  describe('calling log function', () => {
    it('Test case with log method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
    it('Test case with log method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
    it('Test case with log method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
  });

  describe('calling logString function', () => {
    it('Test case with logString method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
    it('Test case with logString method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
    it('Test case with logString method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
  });

  describe('calling logEvent function', () => {
    before(() => {
      event = {
        body: 'event_body',
        headers: 'event_header'
      };
    });

    it('Test case with logEvent method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });

    it('Test case with logEvent method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });

    it('Test case with logEvent method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
  });
});

describe('logger test cases with process env value as error', () => {
  beforeEach(() => {
    process.env.debugValue = logConstants.ERROR;
    printLogSpy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    printLogSpy.restore();
  });

  describe('calling log function', () => {
    it('Test case with log method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
    it('Test case with log method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
    it('Test case with log method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
    it('Test case with log method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
  });

  describe('calling logString function', () => {
    it('Test case with logString method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
    it('Test case with logString method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
    it('Test case with logString method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
    it('Test case with logString method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
  });

  describe('calling logEvent function', () => {
    before(() => {
      event = {
        body: 'event_body',
        headers: 'event_header'
      };
    });

    it('Test case with logEvent method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });

    it('Test case with logEvent method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });

    it('Test case with logEvent method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });

    it('Test case with logEvent method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logEvent method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 0);
    });
  });
});

describe('logger test cases with process env value incorrect', () => {
  beforeEach(() => {
    process.env.debugValue = 'test';
    printLogSpy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    printLogSpy.restore();
  });

  describe('calling log function', () => {
    it('Test case with log method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with log method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.log(callingFunc, logMessage, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
  });

  describe('calling logString function', () => {
    it('Test case with logString method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
    it('Test case with logString method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.logString(callingFunc, data, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
  });

  describe('calling logEvent function', () => {
    before(() => {
      event = {
        body: 'event_body',
        headers: 'event_header'
      };
    });

    it('Test case with logEvent method called successfully with log value debug', () => {
      logVal = logConstants.DEBUG;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with log value info', () => {
      logVal = logConstants.INFO;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with log value warning', () => {
      logVal = logConstants.WARNING;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with log value error', () => {
      logVal = logConstants.ERROR;
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });

    it('Test case with logEvent method called successfully with incorrect log value', () => {
      logVal = 'test';
      customLogger.logEvent(callingFunc, event, logVal);
      assert.equal(printLogSpy.callCount, 1);
    });
  });
});

