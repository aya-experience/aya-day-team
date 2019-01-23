/**
 * Sends back a message through the SSE stream
 * @param {*} ctx - context of the HTTP request
 * @param {String} event - type of response (register, heartbeat etc.)
 * @param {String} data - data to be sent through the stream
 */
exports.sendMessage = (ctx, event, data) => {
  // Set the response status, type and headers
  ctx.response.status = 200;
  ctx.response.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  // Handle heartbeat messages
  if (event === 'heartbeat') {
    ctx.res.write('event: message\n');
    ctx.res.write('data: HEARTBEAT\n\n');
    return;
  }

  // Data wrapper
  const wrapper = {
    value: data,
  };

  // Write through the response stream back to the client
  ctx.res.write(`event: ${event}\n`);
  ctx.res.write(`data: ${JSON.stringify(wrapper)}\n\n`);
};
