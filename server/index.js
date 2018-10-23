const http = require('http').createServer(() => null);
const io = require('socket.io')(http, { origins: '*:*' });

let appSocket = null;
let mobileSocket = null;
let browserSocket = null;

io.on('connection', socket => {
  console.log('a user is now connected');

  socket.on('connect-app', () => {
    console.log('connected to APP');
    appSocket = socket;
    if (mobileSocket) {
      mobileSocket.emit('connect-app');
    }
  });

  socket.on('connect-mobile', () => {
    console.log('connected to MOBILE');
    mobileSocket = socket;
    if (appSocket) {
      mobileSocket.emit('connect-app');
    }

    if (browserSocket) {
      browserSocket.emit('connect-mobile');
    }
  });

  socket.on('connect-browser', () => {
    console.log('connected to BROWSER');
    browserSocket = socket;

    if (mobileSocket) {
      browserSocket.emit('connect-mobile');
    }
  });

  socket.on('do-stuff-on-browser', e => {
    console.log(e);
    if (appSocket) {
      appSocket.emit('do-stuff-on-browser', e);
    }
  });
});

const PORT = 2018;
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
