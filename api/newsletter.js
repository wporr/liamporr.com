const nodemailer = require("nodemailer");
const { MongoClient } = require("mongodb");

/* Connect to email client */
emailAddress = 'liam@liamporr.com';
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
  db.collection('emails').find().toArray()
    .then(receivers => {
      /* Send the emails */
      body = '<h1>Email sent!</h1>';
      sendNewsletter(receivers, body);
    }).catch(error => console.error(error));

});

/* Function to send newsletter */
function sendNewsletter(receivers, body) {
  var mailOptions = {
    from: emailAddress,
    to: receivers.map(doc => doc.email).join(', '),
    subject: "test",
    html: body
  }

  transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}
