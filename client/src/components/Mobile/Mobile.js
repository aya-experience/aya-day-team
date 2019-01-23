import React, { Component } from 'react';
import members from '../../data/members.json';
import WebRTC from '../utils/webrtc';
import Notification from '../Notification';
import Element from '../Element';
import Navbar from '../Navbar';

class Mobile extends Component {
  constructor(props) {
    super(props);

    const sseURL = process.env.REACT_APP_SSE_STREAM;

    this.state = {
      showNotification: false,
      notificationText: '',
      source: new window.EventSource(sseURL),
      key: window.location.search.split('=')[1],
      // eslint-disable-next-line
      webRTC: null
    };
  }

  componentDidMount() {
    const { key } = this.state;
    this.handleSSE();
    this.setState({
      // eslint-disable-next-line
      webRTC: new WebRTC(true, key)
    });
  }

  // TODO: Remove direct DOM manipulation for a React approach
  handlePress = (name, event) => {
    const elements = document.getElementsByClassName('focused');
    Array.prototype.map.call(elements, elem => {
      elem.classList.remove('focused');
    });
    const element = event.target.closest('.element');
    element.classList.add('focused');
  };

  handleNotification = () => {
    this.setState({ showNotification: false });
  };

  handleSSE() {
    const { source } = this.state;

    source.addEventListener('register-mobile', e => {
      const { data } = e;
      // TODO: Register the WebRTC transaction with the desktop client
      console.log('--- DESKTOP SDP: ', data);
    });

    // eslint-disable-next-line
    this.state.source.onmessage = e => {
      console.log('Received message: ', e);
    };

    // eslint-disable-next-line
    this.state.source.onerror = e => {
      console.error(e);
      if (e.target.readyState === window.EventSource.CLOSED) {
        // In case of disconnection
        // Display notification to user
        this.setState({
          notificationText: 'Error: Connection closed',
          showNotification: true
        });

        setTimeout(() => {
          this.setState({ showNotification: false });
        }, 3000);
      } else if (e.target.readyState === window.EventSource.CONNECTING) {
        // In case of connection
        // Display notification to user
        this.setState({
          notificationText: 'Connecting...',
          showNotification: true
        });
      }
    };

    // eslint-disable-next-line
    this.state.source.onopen = e => {
      console.log('Connected.');
      this.setState({
        showNotification: false
      });
    };
  }

  render() {
    const { notificationText, showNotification } = this.state;

    return (
      <div className="bg-near-black app">
        <Notification text={notificationText} isVisible={showNotification} />
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
