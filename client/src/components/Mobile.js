import React, { Component } from "react";
import io from "socket.io-client";
import { Element } from "./Element";
import { Navbar } from "./Navbar";
import { Notification } from "./Notification";
import members from "../data/members.json";

export class Mobile extends Component {
  constructor(props) {
    super(props);

    /* this.socket = io("http://192.168.1.127:2018"); */
    this.socket = io("http://localhost:2018");

    this.state = { isBrowserActived: false };
  }

  handlePress = (name, event) => {
    let elements = document.getElementsByClassName("focused");
    Array.prototype.map.call(elements, (elem) => {
      elem.classList.remove("focused");
    });
    let element = event.target.closest(".element");
    element.classList.add("focused");
    this.socket.emit("do-stuff-on-browser", { name });
  };

  componentDidMount() {
    this.socket.emit("connect-mobile");
    this.socket.on("connect-app", () => {
      this.setState({ isBrowserActived: true });

      setTimeout(() => {
        this.setState({ isBrowserActived: false });
      }, 3000);
    });
  }

  handleNotification = () => {
    this.setState({ isBrowserActived: false });
  };

  render() {
    return (
      <div className="bg-near-black app">
        <Notification
          text="Well connected to the browser!"
          isVisible={this.state.isBrowserActived}
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
