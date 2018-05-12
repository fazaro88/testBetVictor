/* 
 * Test BetVictor
 * index.js
 * @Author: Fabian Zafra
 */
var router = require('express').Router();

router.use('/',  require('./api').router);

module.exports = router;