require('dotenv').config();

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('@koa/cors');
const router = require('./routes/routes');

const app = new Koa();

app.use(logger());
app.use(bodyParser());
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(8080, () => {
  console.log('Listening on port 8080');
});

module.exports = server;
