const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('@koa/cors');
const utils = require('./utils');

const app = new Koa();
const router = new Router();

app.use(logger());
app.use(bodyParser());
app.use(cors());

/**
 * Sends back a message through the SSE stream
 * @param {*} ctx - context of the HTTP request
 * @param {String} event - type of response (register, heartbeat etc.)
 * @param {String} data - data to be sent through the stream
 */
function SSEMessage(ctx, event, data) {
  // Set the response status, type and headers
  ctx.response.status = 200;
  ctx.response.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Handle heartbeat messages
  // Set heartbeat timer to 20s
  if (event === 'heartbeat') {
    ctx.res.write('event: message\n');
    ctx.res.write('data: HEARTBEAT\n\n');
    return;
  }

  // Write through the response stream back to the client
  ctx.res.write(`event: ${event}\n`);
  ctx.res.write(`data: ${data}\n\n`);
}

// ROUTER MIDDLEWARES

/**
 * Register a client's SDP and return a random key
 */
router.post('/register', ctx => {
  // Generate a random key for Redis
  const key = utils.generateKey(true, Math.random);

  // Registering, send message to our SSE stream with the key we generated
  ctx.app.emit('message', {
    type: 'register',
    message: key,
  });

  // TODO: Register client SDP to REDIS with random key
  // HERE

  // Confirm registering process
  SSEMessage(ctx, 'register', 'OK');
});

/**
 * Entry point to the SSE stream
 * When called, set up heartbeats every 20 seconds.
 */
router.get('/stream', ctx => {
  // Resolve this promise once our WebRTC connection is established
  return new Promise(resolve => {
    // Send heartbeat
    SSEMessage(ctx, 'heartbeat', new Date().toLocaleTimeString());

    // Catches messages from other steps of the WebRTC process
    ctx.app.on('message', data => {
      console.log('Message caught with data ', data);
      const { type, message } = data;

      // Handles every type of steps in the WebRTC process
      switch (type) {
        case 'register':
          // Registering, sends back the generated key to the client
          SSEMessage(ctx, 'register', message);
          resolve();
          break;
        default:
          break;
      }
    });
  });
});

app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(8080, () => {
  console.log('Listening on port 8080');
});

module.exports = server;
