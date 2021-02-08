const { MongoClient } = require("mongodb");

/* Connect to mongodb client */
database = "websiteData"
connectionString = `mongodb+srv://wporr:${process.env.ATLAS_PW}@mailinglist.wsoci.mongodb.net/${database}?retryWrites=true&w=majority`
MongoClient.connect(connectionString,
  { useUnifiedTopology: true })
  .then(client => {
  console.log("connected to database");
  const db = client.db(database);
  const receivers = db.collection('emails').find().toArray()
    .then(results => {
      console.log(results);
    }).catch(error => console.error(error));

});
