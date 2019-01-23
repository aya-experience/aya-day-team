const request = require('supertest');
const server = require('./server');

let responseRegisterDesktop;
let responseRegisterMobile;

// TODO: Fix route tests

// Close the server after each test
afterEach(() => {
  server.close();
});

// GET /stream and POST /register before all tests
beforeAll(async done => {
  responseRegisterDesktop = await request(server)
    .post('/register-desktop')
    .send({
      key: 'key-Desktop',
      sdp: 'sdp',
    });
  responseRegisterMobile = await request(server)
    .post('/register-mobile')
    .send({
      key: 'key-Desktop',
      sdp: 'sdp',
    });
  done();
});

describe('Route: /register-desktop', () => {

  it('should respond with a valid status', () => {
    expect(responseRegisterDesktop.status).toEqual(200);
  });

  it('should respond with a valid response type', () => {
    expect(responseRegisterDesktop.type).toEqual('text/event-stream');
  });

  it('should respond with a valid header', () => {
    expect(responseRegisterDesktop.header).toHaveProperty('cache-control', 'no-cache');
    expect(responseRegisterDesktop.header).toHaveProperty('connection', 'keep-alive');
  });

  it('should return a valid response type and random key', () => {
    // Evaluate each line of the response by splitting it
    const resArray = responseRegisterDesktop.text.split('\n');
    const event = resArray[0];
    const data = resArray[1];

    expect(event).toEqual('event: register-desktop-key');
    expect(typeof data).toBe('string');
    expect(data.length).toBeGreaterThan(1);
  });
});

describe('Route: /register-mobile', () => {

  it('should respond with a valid status', () => {
    expect(responseRegisterMobile.status).toEqual(200);
  });

  it('should respond with a valid response type', () => {
    expect(responseRegisterMobile.type).toEqual('text/event-stream');
  });

  it('should respond with a valid header', () => {
    expect(responseRegisterMobile.header).toHaveProperty('cache-control', 'no-cache');
    expect(responseRegisterMobile.header).toHaveProperty('connection', 'keep-alive');
  });

  it('should return a valid response type and random key', () => {
    // Evaluate each line of the response by splitting it
    const resArray = responseRegisterMobile.text.split('\n');
    const event = resArray[0];
    const data = resArray[1];

    expect(event).toEqual('event: register-mobile');
    expect(typeof data).toBe('string');
    expect(data.length).toBeGreaterThan(1);
  });
});
