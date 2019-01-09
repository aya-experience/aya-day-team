import React from "react";
import QR from "./QR";
import * as enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

enzyme.configure({ adapter: new Adapter() });

describe("QR component", () => {
  it("renders the component without crashing", () => {
    const wrapper = enzyme.shallow(<QR URL="testURL" />);
    expect(wrapper).not.toBe(null);
  });

  it("generates a QR code", () => {
    const wrapper = enzyme.shallow(<QR URL="testURL" />);
    expect(wrapper.state().QR).not.toBe("");
  });

  it("displays a QR code", () => {
    const wrapper = enzyme.shallow(<QR URL="testURL" />);
    const qrCode = wrapper.find("img").at(0);
    expect(qrCode.props().src).not.toBe(null);
  });
});
