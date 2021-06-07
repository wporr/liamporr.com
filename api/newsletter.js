const nodemailer = require("nodemailer");
const { MongoClient } = require("mongodb");
const marked = require("marked");
const fs = require("fs");
const util = require("util");
const debug = require("debug");
const readline = require("readline");
const escape = require("escape-html");

/* Globals */
const emailAddress = 'liam@liamporr.com';
const testEmail = 'porrliam@gmail.com';
const displayName = "Liam's newsletter";
const domain = "https://liamporr.com";
const css = `
  <style>
    img {
      max-width: 95%;
    }
  </style>
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = util.promisify(rl.question).bind(rl);

/* Connect to email client */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  pool: true,
  maxMessages: 'Infinity',
  auth: {
    type: 'OAuth2',
    user: 'liam@liamporr.com',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN,
    expires: process.env.TOKEN_EXPIRY,
  }
});

/* Connect to mongodb client */
database = "websiteData";
collection = "testEmails";
connectionString = `mongodb+srv://wporr:${process.env.ATLAS_PW}@mailinglist.wsoci.mongodb.net/${database}?retryWrites=true&w=majority`;

MongoClient.connect(connectionString,
  { useUnifiedTopology: true })
  .then(async client => {
    console.log("connected to database");
    const db = await client.db(database);
    receivers = await db.collection(collection).find().toArray();

    /* Read the content to be sent */
    fileName = process.argv[2]; // 0 is 'node', 1 is js file

    const { title, body } = parseFile(fileName);

    /* Confirm the info before sending */
    var answer = await question(`Title: ${title}. Send test email? (y/n) `);
    if (answer.toLowerCase() == 'y') {
      try {
        await sendNewsletter([{email: testEmail}], title, marked(body));
      } catch(error) {
        console.error(error)
      }
      process.exit();
    }

    answer = await question(`Sending prod email. Confirm sending? (y/n) `);
    if (answer.toLowerCase() == 'y') {
      try {
        console.log("sending emails");

        /* Send the emails */
        // Marked converts the markdown body to html
        await sendNewsletter(receivers, title, marked(body));
      } catch(error) {
        console.error(error)
      }
    } else {
      console.log("aborted.");
    }

    process.exit();
});

function parseFile(fileName) {
  /* Regex for specifying the title and the terminating
   * character for the title in provided files
   */
  const titleRe = /#\s[A-Za-z0-9:\.\s]+\n/g;
  const titleStart = /[A-Za-z0-9:]/g;
  const titleTerm = /\n/g;

  try {
    body = fs.readFileSync(fileName, 'utf8')
  } catch (err) {
    console.error(err);
    process.exit();
  }

  const titleMatch = body.search(titleRe);
  const start = body.search(titleStart);
  const end = body.search(titleTerm);

  if (titleMatch == -1 || end < titleMatch ) {
    console.error("Error: No title specified, please create a title on the " +
      "first line of the md file using the syntax '# <Title>'");
    process.exit();
  }

  const title = body.slice(start, end);

  return {
    title,
    body
  };
}

/* Function to send newsletter */
async function sendNewsletter(receivers, title, body) {
  // Insert inline styling for images, crude but it works
  body = body.replace(/<img/gi, "<img style='max-width: 95%; height: auto;'");
  i = 0;
  messages = receivers.length;
  accepted = [];

  transporter.on("idle", function () {
    while (transporter.isIdle() && receivers.length) {
      r = receivers.shift();
      const unsubscribeLink = "<a href='" + domain +
        "/unsubscribe/?email=" + r.email +
        "' style='color: #888'>Unsubscribe</a>";
      const trackerImg = "<img height='0' width='0' src='" + domain +
        "/open?post=" + escape(title) + "'/>";
      senderBody = body + "\n" + unsubscribeLink;
      senderBody += "\n" + trackerImg;

      var mailOptions = {
        from: displayName + " <" + emailAddress + ">",
        to: r.email,
        subject: title,
        html: senderBody
      }

      transporter.sendMail(mailOptions, (err, info) => {
        i++;
        console.log(err);
        console.log(info);

        if (err) {
          console.log("Email to " + i.toString() + "/" + messages + " failed, continuing");
        } else {
          accepted.push(info.accepted[0]);
          console.log("Email " + i.toString() + "/" + messages + " sent.");
        }
      });
    }
  });
  transporter.emit("idle");
  await question("Hit enter when finished");
  console.log(accepted);
}
