const express = require('express');
const errorPulse = require('errorpulse');

const app = express();

app.use(errorPulse({
  webhookUrl: "YOUR_SLACK_WEBHOOK",
  projectName: "Test App"
}));

app.get('/', (req, res) => {
  res.send("Hello");
});

app.get('/crash', (req, res) => {
  throw new Error("Test crash");
});

app.listen(3000, () => console.log("Running on 3000"));
