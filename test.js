const errorPulse = require('./src/index');

const middleware = errorPulse({
  webhookUrl: "https://example.com"
});

const fakeError = { message: "Test error", status: 500 };
const req = { method: "GET", path: "/test" };
const res = {};
const next = () => console.log("Next called");

middleware(fakeError, req, res, next);
