const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('@koa/cors');
const utils = require('./utils');
const Redis = require('./redis');

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
 * Called when the desktop page is accessed
 * Register the desktop's SDP and return a random key
 */
router.post('/register-desktop', ctx => {
  // Generate a random key for Redis
  const key = utils.generateKey(true, Math.random);

  // Registering, send message to our SSE stream with the key we generated
  ctx.app.emit('message', {
    type: 'register-desktop',
    message: key,
  });

  // Register the Desktop's SDP with Redis here using the generated key
  const SDP = ctx.request.body.sdp;
  const redis = new Redis();
  redis.set(key, SDP);

  // Confirm registering process
  SSEMessage(ctx, 'register-desktop', 'OK');
});

/**
 * Called when the mobile page is accessed
 * Broadcast the mobile's SDP to the desktop
 * Get the desktop's SDP and send it back to the mobile
 */
router.post('/register-mobile', ctx => {});

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
      const { type, message } = data;

      // Handles every type of steps in the WebRTC process
      switch (type) {
        case 'register-desktop':
          // Registering, sends back the generated key to the client
          SSEMessage(ctx, 'register-desktop', message);
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
