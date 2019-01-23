import React from 'react';
import { shallow } from 'enzyme';
import QR from './QR';

describe('QR component', () => {
  it('renders the component without crashing', () => {
    const wrapper = shallow(<QR URL="testURL" />);
    expect(wrapper).not.toBe(null);
  });

  it('generates a QR code', () => {
    const wrapper = shallow(<QR URL="testURL" />);
    expect(wrapper.state().QR).not.toBe('');
  });

  it('displays a QR code', () => {
    const wrapper = shallow(<QR URL="testURL" />);
    const qrCode = wrapper.find('img').at(0);
    expect(qrCode.props().src).not.toBe(null);
  });
});
