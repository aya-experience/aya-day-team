import React from "react";
import { Notification } from "./Notification";
import qr from "./qrwhite2.png";
import mobile from "./mobile.svg";
import arrow from "./arrow.svg";
import webrtc from "./utils/webrtc.js";

export class Desktop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobileAvailable: false,
      source: new EventSource("http://localhost:8080/stream"),
    };
  }

  // TODO: Solve bug of reconnection every 3 seconds.
  componentDidMount() {
    webrtc.handleRTCPeerConnection();

    // On mount, set up SSE event handlers
    this.handleSSE();
  }

  handleSSE() {
    // Catches messages
    this.state.source.onmessage = (e) => {
      console.log("Received message: ", e.data);
    };

    // Catches errors
    this.state.source.onerror = (e) => {
      console.log(e);
      if (e.target.readyState == EventSource.CLOSED) {
        // In case of deconnection
      } else if (e.target.readyState == EventSource.CONNECTING) {
        // In case of reconnection
      }
    };

    // Catches stream opening
    this.state.source.onopen = (e) => {
      console.log("Connected.");
    };
  }

  render() {
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
              <img src={qr} alt="qr" className="qr" />
            </div>
          </div>

          <Notification
            text="A decide has been successfully connected. Wait a second for being redirected"
            isVisible={this.state.isMobileAvailable}
          />
        </div>
      </div>
    );
  }
}
