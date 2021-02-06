var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/subscribe', function(req, res, next) {
  console.log(req);
  console.log("HAI");
  res.send('respond with a resource');
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
