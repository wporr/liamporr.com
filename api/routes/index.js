var express = require('express');
var router = express.Router();
const { MongoClient } = require("mongodb");

/* Connect to mongodb client */
database = "websiteData"
connectionString = `mongodb+srv://wporr:${process.env.ATLAS_PW}@mailinglist.wsoci.mongodb.net/${database}?retryWrites=true&w=majority`
MongoClient.connect(connectionString,
  { useUnifiedTopology: true })
  .then(client => {
  console.log("connected to database");
  const db = client.db(database);
  const emailCollection = db.collection('emails');

  /* Request handler for subscriptions */
  router.post('/subscribe', function(req, res, next) {
    emailCollection.insertOne(req.body)
      .then(result => {
        console.log(result);
      }).catch(error => console.error(error));
  });

  /* Request handler for unsubscribe */
  router.get('/unsubscribe', function(req, res, next) {
    emailCollection.deleteOne(
      { email: req.query.email }
    )
      .then(result => {
        console.log("user " + req.query.email + " unsubscribed");
      }).catch(error => console.error(error));

    res.send("unsubscribed");
  });
});



router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
