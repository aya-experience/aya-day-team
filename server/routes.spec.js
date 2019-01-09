const request = require('supertest');
const server = require('./server');

let responseStream;
let responseRegister;

// TODO: Fix route tests

// Close the server after each test
afterEach(() => {
  server.close();
});

// GET /stream and POST /register before all tests
beforeAll(async done => {
  responseStream = await request(server).get('/stream');
  responseRegister = await request(server).post('/register-desktop');
  done();
});

describe('Route: /stream', () => {
  it('should respond with a valid status', () => {
    expect(responseStream.status).toEqual(200);
  });

  it('should respond with a valid response type', () => {
    expect(responseStream.type).toEqual('text/event-stream');
  });

  it('should respond with a valid header', () => {
    expect(responseStream.header).toHaveProperty('cache-control', 'no-cache');
    expect(responseStream.header).toHaveProperty('connection', 'keep-alive');
  });

  it('should have a valid string response', () => {
    expect(typeof responseStream.text).toBe('string');
  });

  it('should have a valid stream output (heartbeat)', () => {
    // Evaluate each line of the response by splitting it
    const resArray = responseStream.text.split('\n');
    const retry = resArray[0];
    const data = resArray[1];

    expect(retry).toEqual('retry: 20000');
    expect(data).toEqual('data: HEARTBEAT');
  });
});

describe('Route: /register', () => {
  it('should respond with a valid status', () => {
    expect(responseRegister.status).toEqual(200);
  });

  it('should respond with a valid response type', () => {
    expect(responseRegister.type).toEqual('text/event-stream');
  });

  it('should respond with a valid header', () => {
    expect(responseRegister.header).toHaveProperty('cache-control', 'no-cache');
    expect(responseRegister.header).toHaveProperty('connection', 'keep-alive');
  });

  it('should return a valid response type and random key', () => {
    // Evaluate each line of the response by splitting it
    const resArray = responseRegister.text.split('\n');
    const event = resArray[0];
    const data = resArray[1];

    expect(event).toEqual('event: register');
    expect(typeof data).toBe('string');
    expect(data.length).toBeGreaterThan(1);
  });
});
