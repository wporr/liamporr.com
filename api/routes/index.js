var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
const { MongoClient } = require("mongodb");

const emailAddress = 'liam@liamporr.com';

/* Connect to email client */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailAddress,
    pass: process.env.EMAIL_PW
  }
});

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
    if (!("email" in req.body)) {
      console.error("Subscription calll with no email!");
      return;
    }

    emailCollection.insertOne(req.body)
      .then(result => {

        /* Send email confirmation */
        var body;

        if ("name" in req.body) {
          body = req.body.name;
        } else {
          body = "Anonymous";
        }
        body += " subscribed with email: " + req.body.email;
        console.log(body);

        var mailOptions = {
          from: emailAddress,
          to: emailAddress,
          subject: "New subscription!",
          text: body
        }

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
          }
        });
      }).catch(error => console.error(error));
  });

  /* Request handler for unsubscribe */
  router.get('/unsubscribe', function(req, res, next) {
    emailCollection.deleteOne(
      { email: req.query.email }
    ).then(result => {
        const body = "Email " + req.query.email + " unsubscribed"
        console.log(body);

        /* Send email confirmation */
        var mailOptions = {
          from: emailAddress,
          to: emailAddress,
          subject: "User Unsubscribed",
          text: body
        }

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
          }
        });
      }).catch(error => console.error(error));
    res.send("unsubscribed");
  });
});


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
