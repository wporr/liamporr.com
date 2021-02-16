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
const displayName = "Liam's newsletter";
const domain = "http://localhost:8000";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = util.promisify(rl.question).bind(rl);

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
  .then(async client => {
    console.log("connected to database");
    const db = await client.db(database);
    receivers = await db.collection('emails').find().toArray();

    /* Read the content to be sent */
    fileName = process.argv[2]; // 0 is 'node', 1 is js file

    const { title, body } = parseFile(fileName);

    /* Confirm the info before sending */
    var answer = await question(`Title: ${title}. Send test email? (y/n) `);
    if (answer.toLowerCase() == 'y') {
      try {
        await sendNewsletter([{email: emailAddress}], title, marked(body));
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
  const titleRe = /#\s[A-Za-z0-9\s]+\n/g;
  const titleStart = /[A-Za-z0-9]/g;
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
  for (const r of receivers) {
    const unsubscribeLink = "<a href='" + domain +
      "/unsubscribe/?email=" + r.email +
      "' style='color: #888'>Unsubscribe</a>";
    const trackerImg = "<img height='0' width='0' src='" + domain +
      "/open?post=" + escape(title) + "'/>";
    body += "\n" + unsubscribeLink;
    body += "\n" + trackerImg;

    var mailOptions = {
      from: displayName + " <" + emailAddress + ">",
      to: r.email,
      subject: title,
      html: body
    }

    const items = await transporter.sendMail(mailOptions);
    if (items == {} ||
        items.accepted.length != 1 ||
        items.accepted[0] != r.email) {
      console.error("Error, email not accepted");
      debug("items rejected: ");
    }
    debug(toString(items));
  }
}
