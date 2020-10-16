var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/getEnv', (req, res, next) => {
  const envData = require('../config/env.json')[process.env.NODE_ENV || 'development'];
  res.json(envData);
});

module.exports = router;
