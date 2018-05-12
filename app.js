/* 
 * Test BetVictor
 * app.js
 * @Author: Fabian Zafra
 */
'use strict';

const express = require('express');
const helmet = require('helmet');
const os = require('os');
const _ = require('lodash');
const logger = require('winston');

const configuration = require('./config.json');

/**
 * Closes the application.
 * It waits for TIMEOUT_CLOSE seconds before closing definitely.
 */
function closeApplication() {
    setTimeout(function() {
        process.exit(0);
    }, _.get(configuration, 'timeout'));
};

/**
 * Starts the express application
 */
function startExpress() {
    let server;
    const routes = require('./js/routes');
    const app = express();
    
    app.use(express.json());
    app.use(routes);
    app.use(helmet());

    server = app.listen(_.get(configuration, 'port'), function() {
        logger.info('app.startExpress(): Listening on port ' + _.get(configuration, 'port'));
        logger.info('app.startExpress(): Protocol: HTTP');
    });
};

try {
    const releaseFile = require('./release.json');
    logger.info('Test BetVictor service Starts:', { version: releaseFile, host: os.hostname()});

    process.on('uncaughtException', function (err) {
        logger.error('app.(): uncaughtException', { message : err.message, stack : err.stack }); 
        closeApplication();
    });

    process.on('SIGINT', closeApplication);
    startExpress();
} catch(exception) {
    logger.error('app.(): Error',  { message : exception.message, stack : exception.stack });
}
