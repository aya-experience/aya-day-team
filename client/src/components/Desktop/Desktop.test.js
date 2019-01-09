import React from "react";
import Desktop from "./Desktop";
import * as enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import EventSource, { sources } from "eventsourcemock";

enzyme.configure({ adapter: new Adapter() });

// Unmock WebRTC related methods
jest.unmock("../utils/webrtc.js");
const myModule = require("../utils/webrtc");
// Mock the method using unmockable object RTCPeerConnection
myModule.handleRTCPeerConnection = jest.fn();

Object.defineProperty(window, "EventSource", {
  value: EventSource,
});

describe("Desktop component", () => {
  beforeEach(() => {
    console = {
      ...console,
      log: jest.fn(),
      error: jest.fn(),
    };
  });

  it("renders the component without crashing", () => {
    const wrapper = enzyme.shallow(<Desktop />);
    expect(wrapper).not.toBe(null);
  });

  it("should log a message from the SSE stream", () => {
    enzyme.shallow(<Desktop />);
    const message = {
      data: "Toto",
    };
    sources["http://localhost:8080/stream"].emitMessage(message);
    expect(console.log).toHaveBeenCalledWith(
      "Received message: ",
      message.data,
    );
  });

  it("should log an error message from the SSE stream", () => {
    enzyme.shallow(<Desktop />);
    const error = new Error("Something went wrong.");
    sources["http://localhost:8080/stream"].emitError(error);
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it("should log a message from the SSE stream when opened", () => {
    enzyme.shallow(<Desktop />);
    sources["http://localhost:8080/stream"].emitOpen();
    const message = "Connected.";
    expect(console.log).toHaveBeenCalledWith(message);
  });
});
