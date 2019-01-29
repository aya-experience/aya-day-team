import React from 'react';
import { shallow } from 'enzyme';
import EventSource, { sources } from 'eventsourcemock';
import Desktop from './Desktop';

// Mock our WebRTC class
jest.mock('../utils/webrtc.js');

Object.defineProperty(window, 'EventSource', {
  value: EventSource
});

describe('Desktop component', () => {
  beforeAll(() => {
    global.console = {
      ...console,
      log: jest.fn(),
      error: jest.fn()
    };
  });

  it('renders the component without crashing', () => {
    const wrapper = shallow(<Desktop />);
    expect(wrapper).not.toBe(null);
  });

  it('should log a message from the SSE stream', () => {
    shallow(<Desktop />);
    const message = {
      data: 'Toto'
    };
    sources['http://localhost:8080/stream'].emitMessage(message);
    expect(console.log).toHaveBeenCalledWith('Received message: ', message);
  });

  it('should log an error message from the SSE stream', () => {
    shallow(<Desktop />);
    const error = new Error('Something went wrong.');
    sources['http://localhost:8080/stream'].emitError(error);
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it('should log a message from the SSE stream when opened', () => {
    shallow(<Desktop />);
    sources['http://localhost:8080/stream'].emitOpen();
    const message = 'Connected.';
    expect(console.log).toHaveBeenCalledWith(message);
  });
});
