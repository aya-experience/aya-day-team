const Router = require('koa-router');
const utils = require('../utils/utils');
const Redis = require('../redis/redis.service');
const sse = require('../sse/sse');

const router = new Router();

const redis = new Redis();

/**
 * Called when the desktop page is accessed
 * Register the desktop's SDP and return a random key
 */
router.post('/register-desktop', async ctx => {
  // Generate a random key for Redis
  const key = utils.generateKey(true, Math.random);

  // Registering, send message to our SSE stream with the key we generated
  ctx.app.emit('message', {
    type: 'register-desktop-key',
    message: key,
  });

  // Register the Desktop's SDP with Redis here using the generated key
  const SDP = ctx.request.body.sdp;
  const res = await redis.set(key, SDP);

  if (!res) {
    console.error('Error, could not set value');
  }

  redis.subscribe(key);

  console.log('-- KEY: ', key);

  // Called when we receive the mobile SDP
  redis.subscriber.on('message', (channel, message) => {
    // Send mobile SDP to desktop
    ctx.app.emit('message', {
      type: 'register-desktop-sdp',
      message,
    });
  });

  // Confirm registering process
  sse.sendMessage(ctx, 'register-desktop-key', 'OK');
});

/**
 * Called when the mobile page is accessed
 * Broadcast the mobile's SDP to the desktop
 * Get the desktop's SDP and send it back to the mobile
 */
router.post('/register-mobile', async ctx => {
  // Random key to get the desktop SDP from the Redis database
  const { key, sdp } = ctx.request.body;

  // Get the SDP from the database
  const desktopSDP = await redis.get(key);

  redis.publish(key, sdp);

  // Send desktop SDP to mobile
  ctx.app.emit('message', {
    type: 'register-mobile',
    message: desktopSDP,
  });

  sse.sendMessage(ctx, 'register-mobile', 'OK');
});

router.get('/stream', ctx => {
  // Send heartbeat
  sse.sendMessage(ctx, 'heartbeat', new Date().toLocaleTimeString());

  // Start a promise to catch events sent by other routes
  // Resolve this promise once our WebRTC connection is established
  return new Promise(() => {
    // Catches messages from other steps of the WebRTC process
    ctx.app.on('message', data => {
      const { type, message } = data;

      // Handles every type of steps in the WebRTC process
      switch (type) {
        case 'register-desktop-key':
          // Registering, sends back the generated key to the client
          sse.sendMessage(ctx, 'register-desktop-key', message);
          break;
        case 'register-desktop-sdp':
          sse.sendMessage(ctx, 'register-desktop-sdp', message);
          break;
        case 'register-mobile':
          sse.sendMessage(ctx, 'register-mobile', message);
          break;
        default:
          break;
      }
    });
  });
});

module.exports = router;
