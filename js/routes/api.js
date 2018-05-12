/* 
 * Test BetVictor
 * index.js
 * @Author: Fabian Zafra
 */
'use strict';

const _ = require('lodash');
const LRUCache = require("lru-cache");
const path = require('path');
const logger = require('winston');

const APPDIR = path.join(__dirname, '..', '..');

const configuration = require(path.join(APPDIR,'config.json'));
const mockResult = require(path.join(APPDIR,'mockResult.json'));

const cache = new LRUCache(_.get(configuration, 'cache'));
const router = require('express').Router();

/* CONSTANTS */
const TYPE_ERROR = 400;
const MSG_ERROR = 'ERROR: Bad request!';
const CACHE_SEPARATOR = '-';


/* FUNCTION TO GET MOCK DATA */
function getMockSports(){
    return _.get(mockResult, 'sports', []);
}

function getMockEvents(sportId){
    if (_.isNil(sportId)){
        return [];
    }
    const sport = _.find(mockResult.sports, (s) => s.id == sportId);
    return _.get(sport, 'events', []);
}

function getMockOutcomes(sportId, eventId){
    const events = getMockEvents(sportId);
    if(_.isEmpty(events)){
        return [];
    }
    const event = _.find(events, (e) => e.id == eventId);
    return (!_.isNil(event)) ? _.get(event, 'outcomes', []) : [];
}

/**
 * [GET - Get all sports]
 *
 * @param  {[type]}   req  [The Express request]
 * @param  {[type]}   res  [The Express response]
 * @param  {Function} next [The Express next]
 *
 */
function getSports(req, res, next) {
    logger.info('api.getSport(): Request!');
    return res.json(getMockSports());
}

/**
 * [GET - Get all events by sportId]
 *
 * @param  {[type]}   req  [The Express request]
 * @param  {[type]}   res  [The Express response]
 * @param  {Function} next [The Express next]
 *
 */
function getEvents(req, res, next) {
    logger.info('api.getEvents(): Request!', _.get(req, 'params'));
    const sportId = _.get(req, 'params.sportId');
    if (_.isNil(sportId)) {
        logger.error('api.getEvents(): Error!');
        return res.status(TYPE_ERROR).send(MSG_ERROR);
    } 
  
    const events = cache.get(sportId);
    if(_.isNil(events)) {
        const result = getMockEvents(sportId);
        cache.set(sportId, result);
        logger.info('api.getEvents(): Result not cached!');
        return res.json(result);
    } else {
        logger.info('api.getEvents(): Result cached!');
        return res.json(events);
    }
}

/**
 * [GET - Get all outcomes by sportId and eventId]
 *
 * @param  {[type]}   req  [The Express request]
 * @param  {[type]}   res  [The Express response]
 * @param  {Function} next [The Express next]
 *
 */
function getOutcomes(req, res, next) {
    const sportId = _.get(req, 'params.sportId');
    const eventId = _.get(req, 'params.eventId');
    logger.info('api.getOutcomes(): Request!', _.get(req, 'params'));
    if (_.isNil(sportId) || _.isNil(eventId)) {
        logger.error('api.getOutcomes(): Error!');
        return res.status(TYPE_ERROR).send(MSG_ERROR);
    } 

    const cacheKey = sportId + CACHE_SEPARATOR + eventId;
    const outComes = cache.get(cacheKey);
    if(_.isNil(outComes)) {
        const result = getMockOutcomes(sportId, eventId);
        cache.set(cacheKey, result);
        logger.info('api.getOutcomes(): Result not cached!');
        return res.json(result);
    } else {
        logger.info('api.getOutcomes(): Resutl cached!');
        return res.json(outComes);
    }
}

// Get all sports
router.get('/sports', getSports);
// Get events by sportId
router.get('/sports/:sportId', getEvents);
// Get outcomes by sportId and eventId
router.get('/sports/:sportId/events/:eventId', getOutcomes);

// Expose API
module.exports = {
   router: router,
   getSports: getSports,
   getEvents: getEvents,
   getOutcomes: getOutcomes,
   getMockSports: getMockSports,
   getMockEvents: getMockEvents,
   getMockOutcomes: getMockOutcomes
};
