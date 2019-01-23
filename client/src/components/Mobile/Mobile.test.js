import React from 'react';
import EventSource, { sources } from 'eventsourcemock';
import { shallow } from 'enzyme';
import Mobile from './Mobile';

// Mock our WebRTC class
jest.mock('../utils/webrtc.js');

Object.defineProperty(window, 'EventSource', {
  value: EventSource
});

Object.defineProperty(window, 'RTCPeerConnection', {
  value: Object
});

describe('Desktop component', () => {
  let wrapper;

  beforeAll(() => {
    global.console = {
      ...console,
      log: jest.fn(),
      error: jest.fn()
    };
  });

  it('renders the component without crashing', () => {
    expect(wrapper).not.toBe(null);
  });

  it('should log a message from the SSE stream', () => {
    shallow(<Mobile />);

    const message = {
      data: 'Toto'
    };
    sources['http://localhost:8080/stream'].emitMessage(message);
    expect(console.log).toHaveBeenCalledWith('Received message: ', message);
  });

  // TODO: Add unit tests for error messages and notifications

  it('should log a message from the SSE stream when opened', () => {
    shallow(<Mobile />);
    sources['http://localhost:8080/stream'].emitOpen();
    const message = 'Connected.';
    expect(console.log).toHaveBeenCalledWith(message);
  });
});
