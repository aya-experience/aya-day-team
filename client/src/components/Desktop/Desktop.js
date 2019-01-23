import React from 'react';
import mobile from './mobile.svg';
import arrow from './arrow.svg';
import WebRTC from '../utils/webrtc';
import QR from './QR/QR';
import Notification from '../Notification';

class Desktop extends React.Component {
  constructor(props) {
    super(props);

    const sseURL = process.env.REACT_APP_SSE_STREAM;

    this.state = {
      isMobileAvailable: false,
      source: new window.EventSource(sseURL),
      webRTC: new WebRTC()
    };
  }

  componentDidMount() {
    // On mount, set up SSE event handlers
    this.handleSSE();
  }

  handleSSE() {
    const { source, webRTC } = this.state;
    source.addEventListener('register-desktop-key', e => {
      const data = JSON.parse(e.data);

      // Get URL based on current environment and the key we received
      const QRUrl = `${process.env.REACT_APP_MOBILE}?key=${data.value}`;

      this.setState({
        QRUrl
      });
    });

    source.addEventListener('register-desktop-sdp', e => {
      const data = JSON.parse(e.data);

      // TODO: set mobile SDP for WebRTC connection

      console.log('--- MOBILE SDP: ', data.value);
      webRTC.onAnswer(data.value, 'answer');
    });

    // Catches messages
    source.onmessage = e => {
      console.log('Received message: ', e);
    };

    // Catches errors
    source.onerror = e => {
      console.error(e);
    };

    source.onopen = () => {
      console.log('Connected.');
    };
  }

  render() {
    const { QRUrl, isMobileAvailable } = this.state;

    return (
      <div className="bg-near-black app desktop">
        <div className="container">
          <div className="mega-size">
            <div className="icon-kanji" />
            <h1>TEAM</h1>
          </div>

          <div className="columns weird-margin">
            <div className="column">
              <p className="p-mobile custom-margin">
                Visite nos planètes directement...
              </p>
              <img src={arrow} alt="arrow" className="arrow" />
            </div>
            <div className="column">
              <img src={mobile} alt="mobile" className="mobile-mini" />
              <p className="p-mobile">
                OU prend le controle avec ton smartphone
              </p>

              {QRUrl != null ? <QR URL={QRUrl} /> : <div>Loading...</div>}
            </div>
          </div>

          <Notification
            text="A device has been successfully connected. Wait a second for being redirected"
            isVisible={isMobileAvailable}
          />
        </div>
      </div>
    );
  }
}

export default Desktop;
