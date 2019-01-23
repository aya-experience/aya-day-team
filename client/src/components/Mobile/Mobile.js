import React, { Component } from "react";
import { Element } from "../Element";
import { Navbar } from "../Navbar";
import { Notification } from "../Notification";
import members from "../../data/members.json";
import WebRTC from "../utils/webrtc.js";

class Mobile extends Component {
  constructor(props) {
    super(props);

    const sseURL = process.env.REACT_APP_SSE_STREAM;

    this.state = {
      showNotification: false,
      notificationText: "",
      source: new EventSource(sseURL),
      key: window.location.search.split("=")[1],
      webRTC: null,
    };
  }

  // TODO: Remove direct DOM manipulation for a React approach
  handlePress = (name, event) => {
    let elements = document.getElementsByClassName("focused");
    Array.prototype.map.call(elements, (elem) => {
      elem.classList.remove("focused");
    });
    let element = event.target.closest(".element");
    element.classList.add("focused");
  };

  handleSSE() {
    this.state.source.addEventListener("register-mobile", (e) => {
      const data = e.data;
      // TODO: Register the WebRTC transaction with the desktop client
      console.log("--- DESKTOP SDP: ", data);
    });

    // eslint-disable-next-line
    this.state.source.onmessage = (e) => {
      console.log("Received message: ", e);
    };

    // eslint-disable-next-line
    this.state.source.onerror = (e) => {
      console.error(e);
      if (e.target.readyState === EventSource.CLOSED) {
        // In case of disconnection
        // Display notification to user
        this.setState({
          notificationText: "Error: Connection closed",
          showNotification: true,
        });

        setTimeout(() => {
          this.setState({ showNotification: false });
        }, 3000);
      } else if (e.target.readyState === EventSource.CONNECTING) {
        // In case of connection
        // Display notification to user
        this.setState({
          notificationText: "Connecting...",
          showNotification: true,
        });
      }
    };

    // eslint-disable-next-line
    this.state.source.onopen = (e) => {
      console.log("Connected.");
      this.setState({
        showNotification: false,
      });
    };
  }

  componentDidMount() {
    this.handleSSE();
    this.setState({
      webRTC: new WebRTC(true, this.state.key),
    });
  }

  handleNotification = () => {
    this.setState({ showNotification: false });
  };

  render() {
    return (
      <div className="bg-near-black app">
        <Notification
          text={this.state.notificationText}
          isVisible={this.state.showNotification}
        />
        <Navbar />
        <div className="content pt5">
          <div className="ttu tc self-center tracked f3 pb2 team">Team</div>
          <div className="oval" />
          <div className="elements pt4 pr2 pl2">
            {members.map((member, index) => (
              <Element
                handleClick={this.handlePress}
                key={member.name}
                member={member}
                reversed={index % 2 !== 0}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Mobile;
