/* 
 * Test BetVictor
 * apiTest.js: Unit test class to evaluate API
 * @Author: Fabian Zafra
 */
'use strict';

const express = require('express');
const path = require('path');
const assert = require('assert');
const request = require('supertest');
const _ = require('lodash');

const APPDIR = path.join(__dirname,'..');

const api = require(path.join(APPDIR,'js','routes','api'));
const mockResult = require(path.join(APPDIR,'mockResult.json'));

const app = express();
app.use(express.json());
app.get('/sports',api.getSports);
app.get('/sports/:sportId',api.getEvents);
app.get('/sports/:sportId/events/:eventId',api.getOutcomes);

/* CONSTANTS */
const HTTP_OK = 200;
const HTTP_KO = 400;

describe('API TESTING', function() {
    describe('#GetSports', function() {
        it('Result OK', function(done){
            request(app).get('/sports').expect(HTTP_OK).end(
                function(err, res){
                    const resMocked =_.get(mockResult, 'sports');
                    assert.equal(res.body.length, resMocked.length);
                    assert.equal(res.body[0].id,resMocked[0].id);
                    assert.equal(res.body[1].id,resMocked[1].id);
                    done();
                }
            );
        });
    });
    describe('#GetEvents', function() {
        it('Error', function(done){
            request(app).get('/sports/').expect(HTTP_KO).end(
                function(err, res){
                    done();
                }
            );
        });
        it('Empty result', function(done){
            request(app).get('/sports/5847').expect(HTTP_OK).end(
                function(err, res){
                    assert.equal(res.body.length, 0);
                    done();
                }
            );
        });
        it('Result OK', function(done){
            request(app).get('/sports/100').expect(HTTP_OK).end(
                function(err, res){
                    const resMocked = _.find(mockResult.sports, (s) => s.id == 100);
                    assert.equal(res.body.length, resMocked.events.length);
                    assert.equal(res.body[0].id,resMocked.events[0].id);
                    assert.equal(res.body[1].id,resMocked.events[1].id);
                    done();
                }
            );
        });
    });
    describe('#GetOutcomes', function() {
        it('Error sportId', function(done){
            request(app).get('/sports//events').expect(HTTP_KO).end(
                function(err, res){
                    done();
                }
            );
        });
        it('Error eventId', function(done){
            request(app).get('/sports/100/').expect(HTTP_KO).end(
                function(err, res){
                    done();
                }
            );
        });
        it('Empty result', function(done){
            request(app).get('/sports/5847/events/852').expect(HTTP_OK).end(
                function(err, res){
                    assert.equal(res.body.length, 0);
                    done();
                }
            );
        });
        it('Result OK', function(done){
            request(app).get('/sports/100/events/943238300').expect(HTTP_OK).end(
                function(err, res){
                    const sportMocked = _.find(mockResult.sports, (s) => s.id == 100);
                    const resMocked = _.find(sportMocked.events, (e) => e.id == 943238300);
                    assert.equal(res.body.length, resMocked.outcomes.length);
                    assert.equal(res.body[0].id,resMocked.outcomes[0].id);
                    assert.equal(res.body[1].id,resMocked.outcomes[1].id);
                    done();
                }
            );
        });
    }); 
    describe('#GetMockSports ', function() {
        it('Result OK', function(done){
            const res = api.getMockSports();
            const resMocked =_.get(mockResult, 'sports');
            assert.equal(res.length, resMocked.length);
            assert.equal(res[0].id,resMocked[0].id);
            assert.equal(res[1].id,resMocked[1].id);
            done();
        });
    });
    describe('#GetMockEvents', function() {
        it('Empty result', function(done){
            const res = api.getMockEvents();
            assert.equal(res.length, 0);
            done();
        });
        it('Empty result', function(done){
            const res = api.getMockEvents('empty');
            assert.equal(res.length, 0);
            done();
        });
        it('Result OK', function(done){
            const res = api.getMockEvents(100);
            const resMocked =_.find(mockResult.sports, (s) => s.id == 100);
            assert.equal(res.length, resMocked.events.length);
            assert.equal(res[0].id,resMocked.events[0].id);
            assert.equal(res[1].id,resMocked.events[1].id);
            done();
        });
    });
    describe('#GetMockOutcomes', function() {
        it('Empty result', function(done){
            const res = api.getMockOutcomes();
            assert.equal(res.length, 0);
            done();
        });
        it('Empty result', function(done){
            const res = api.getMockOutcomes('empty');
            assert.equal(res.length, 0);
            done();
        });
        it('Empty result', function(done){
            const res = api.getMockOutcomes(100,'empty');
            assert.equal(res.length, 0);
            done();
        });
        it('Result OK', function(done){
            const res = api.getMockOutcomes(100,943238300);
            const sportMocked =_.find(mockResult.sports, (s) => s.id == 100);
            const resMocked = _.find(sportMocked.events, (e) => e.id == 943238300);
            assert.equal(res.length, resMocked.outcomes.length);
            assert.equal(res[0].id,resMocked.outcomes[0].id);
            assert.equal(res[1].id,resMocked.outcomes[1].id);
            done();
        });
    });
});