const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const utils = require('./utils');

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cors());

// Sends a heartbeat response every 20 seconds
// Set heartbeat response to 20s
function heartbeat(res) {
  res.write('retry: 20000\n');
  res.write(`data: HEARTBEAT\n\n`);
}

function SSEMessage(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${data}\n\n`);
}

// ROUTER MIDDLEWARES

// Registers a client's SDP and returns a randomly generated storage key
router.post('/register', ctx => {
  console.log('SDP Received: ', ctx.request.body);

  // Set response status, type and header
  ctx.response.status = 200;
  ctx.response.type = 'text/event-stream; charset=utf-8';
  ctx.response.set({
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Generate a random key for Redis
  const key = utils.generateKey(true);
  console.log('Key generated: ', key);

  // TODO: Register client SDP to REDIS with random key
  // HERE

  // Send the random key back to the client
  SSEMessage(ctx.res, 'register', key);
});

// Starts an SSE stream with a given client
router.get('/stream', ctx => {
  console.log('Connected to stream');

  // Set the response status, type and header
  ctx.response.status = 200;
  ctx.response.type = 'text/event-stream';
  ctx.response.set({
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Send back a heartbeat response every 20s
  heartbeat(ctx.res, new Date().toLocaleTimeString());
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, () => {
  console.log('Listening on port 8080');
});
