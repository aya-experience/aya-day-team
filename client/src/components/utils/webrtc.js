/* eslint-disable no-undef */

const axios = require('axios');

// Seperate the WebRTC connection process into specific functions
class WebRTC {
  /**
   * Sets up the WebRTC connection
   * @param {*} isMobile - True if we are on the mobile client
   * @param {*} key - The Redis key used to get the desktop SDP
   */
  constructor(isMobile, key) {
    // eslint-disable-next-line
    console.log(
      `--- Setting up WebRTC, isMobile: ${isMobile}, Redis key: ${key}`
    );

    this.isMobile = isMobile;
    this.key = key;

    this.handleRTCPeerConnection();
  }

  handleRTCPeerConnection() {
    const configuration = {
      iceServers: [{ urls: 'stun:stun.1.google.com:19302' }]
    };

    this.myConnection = new RTCPeerConnection(configuration);

    // Catch data channel messages
    this.myConnection.ondatachannel = event => {
      const receiveChannel = event.channel;
      receiveChannel.onmessage = message => {
        // eslint-disable-next-line
        console.log('ondatachannel message:', message.data);
      };
    };

    this.createOffer();
    this.openDataChannel();
  }

  // Get local session description and make an offer
  createOffer() {
    this.myConnection.createOffer(
      offer => {
        // eslint-disable-next-line
        console.log('Creating and sending SDP.');

        if (this.isMobile) {
          this.registerMobileSDP(offer.sdp, this.key);
        } else {
          this.registerSDP(offer);
        }

        this.myConnection.setLocalDescription(offer);
      },
      error => {
        // eslint-disable-next-line
        console.log('Error on offer creation. ', error);
      }
    );
  }

  // Creates a data channel
  openDataChannel() {
    // eslint-disable-next-line
    console.log('Opening data channel.');
    const dataChannelOptions = {
      reliable: true
    };

    this.dataChannel = this.myConnection.createDataChannel(
      'myDataChannel',
      dataChannelOptions
    );

    this.dataChannel.onerror = error => {
      // eslint-disable-next-line
      console.log('Error:', error);
    };

    this.dataChannel.onmessage = event => {
      // eslint-disable-next-line
      console.log('Got message:', event.data);
    };
  }

  registerMobileSDP = (sdp, key) => {
    const options = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      }
    };

    axios.post(
      'http://localhost:8080/register-mobile',
      {
        sdp,
        key
      },
      options
    );
  };

  registerSDP = sdp => {
    const options = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      }
    };

    axios.post('http://localhost:8080/register-desktop', sdp, options);
  };

  send = value => {
    const url = 'http://localhost:8080/stream';
    const Http = new XMLHttpRequest();
    Http.open('POST', url);
    Http.setRequestHeader('Content-type', 'application/json');
    Http.setRequestHeader('Access-Control-Allow-Origin', '*');
    Http.send(JSON.stringify(value));
  };

  // When another user answers to our offer
  onAnswer(sdp, type) {
    const answer = {};
    answer.sdp = sdp;
    answer.type = type;
    this.myConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  // When we got ice candidate from another user
  onCandidate(candidate) {
    this.myConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }
}

module.exports = WebRTC;
