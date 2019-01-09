import React from "react";
import Mobile from "./Mobile";
import * as enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import EventSource from "eventsourcemock";
import { MemoryRouter } from "react-router";

enzyme.configure({ adapter: new Adapter() });

// Unmock WebRTC related methods
jest.unmock("../utils/webrtc.js");
const myModule = require("../utils/webrtc");
// Mock the method using unmockable object RTCPeerConnection
myModule.handleRTCPeerConnection = jest.fn();

Object.defineProperty(window, "EventSource", {
  value: EventSource,
});

Object.defineProperty(window, "URLSearchParams", {
  value: Object,
});

describe("Desktop component", () => {
  let wrapper;

  beforeAll(() => {
    wrapper = enzyme.shallow(
      <MemoryRouter>
        <Mobile />
      </MemoryRouter>,
    );
  });

  // TODO: Add SSE stream unit tests
  it("renders the component without crashing", () => {
    expect(wrapper).not.toBe(null);
  });
});
