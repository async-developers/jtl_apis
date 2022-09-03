'use strict';

const path = require('path');
const logger = require('logger/customLogger');
const logConstants = require('logger/loggerConstants');

const fileName = path.basename(__filename);

const express = require('express');

const port = 8081;

const server = express();

// Parsers for POST data
server.use(express.json({limit: '100mb'}));
server.use(express.urlencoded({ limit: '100mb', extended: true })); 

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept,Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

/**
 * Get api routes.
 */
const db = require('./routes/db/db');

/**
 * Set api routes.
 */
server.use('/api/send-email', db);

server.set('port', port);

server.listen(port, () => logger.logString(fileName, `API running on localhost:${port}`, logConstants.INFO));
