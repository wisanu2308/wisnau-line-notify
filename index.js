const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: "e1rPBMMZB76WAU71DoYxQYcVI8HtarWWSRrH9SNzjRQlwV/2pI01LOkeJ2EuHm6mGbJAca0r8ZnQ9W6EyLM8RjnOkDvO1I/KCwwZidKdObCiSXxOPe/5z/Co2aRHx2b68JzT5T3Tz1LAhbGRe4TA5AdB04t89/1O/w1cDnyilFU=",
  channelSecret: "1c06af3579e079c122dbf1e66b82af5f",
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc

app.post('/',(req, res) => {
  console.log("initial")
});

app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});