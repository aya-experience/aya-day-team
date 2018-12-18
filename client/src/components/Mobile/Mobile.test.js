import React from "react";
import Mobile from "./Mobile";
import * as enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import EventSource, { sources } from "eventsourcemock";

enzyme.configure({ adapter: new Adapter() });

// Mock our WebRTC class
jest.mock("../utils/webrtc.js");

Object.defineProperty(window, "EventSource", {
  value: EventSource,
});

Object.defineProperty(window, "RTCPeerConnection", {
  value: Object,
});

describe("Desktop component", () => {
  let wrapper;

  beforeAll(() => {
    console = {
      ...console,
      log: jest.fn(),
      error: jest.fn(),
    };
  });

  it("renders the component without crashing", () => {
    expect(wrapper).not.toBe(null);
  });

  it("should log a message from the SSE stream", () => {
    enzyme.shallow(<Mobile />);

    const message = {
      data: "Toto",
    };
    sources["http://localhost:8080/stream"].emitMessage(message);
    expect(console.log).toHaveBeenCalledWith("Received message: ", message);
  });

  // TODO: Add unit tests for error messages and notifications

  it("should log a message from the SSE stream when opened", () => {
    enzyme.shallow(<Mobile />);
    sources["http://localhost:8080/stream"].emitOpen();
    const message = "Connected.";
    expect(console.log).toHaveBeenCalledWith(message);
  });
});
