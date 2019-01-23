const axios = require("axios");

// Seperate the WebRTC connection process into specific functions
class WebRTC {
  /**
   * Sets up the WebRTC connection
   * @param {*} isMobile - True if we are on the mobile client
   * @param {*} key - The Redis key used to get the desktop SDP
   */
  constructor(isMobile, key) {
    console.log(
      `--- Setting up WebRTC, isMobile: ${isMobile}, Redis key: ${key}`,
    );

    this.isMobile = isMobile;
    this.key = key;

    this.handleRTCPeerConnection();
  }

  handleRTCPeerConnection() {
    var configuration = {
      iceServers: [{ urls: "stun:stun.1.google.com:19302" }],
    };

    this.myConnection = new RTCPeerConnection(configuration);

    // Catch data channel messages
    this.myConnection.ondatachannel = (event) => {
      var receiveChannel = event.channel;
      receiveChannel.onmessage = (event) => {
        console.log("ondatachannel message:", event.data);
      };
    };

    // Catch new ICE candidate
    this.myConnection.onicecandidate = (event) => {
      // when the browser finds an ice candidate we send it to another peer
      if (event.candidate) {
        this.send({
          type: "candidate",
          message: event.candidate,
        });
      }
    };

    this.createOffer();
    this.openDataChannel();
  }

  // Get local session description and make an offer
  createOffer() {
    this.myConnection.createOffer(
      (offer) => {
        console.log("Creating and sending SDP.");

        if (this.isMobile) {
          this.registerMobileSDP(offer.sdp, this.key);
        } else {
          this.registerSDP(offer);
        }

        this.myConnection.setLocalDescription(offer);
      },
      (error) => {
        console.log("Error on offer creation. ", error);
      },
    );
  }

  // Creates a data channel
  openDataChannel() {
    console.log("Opening data channel.");
    var dataChannelOptions = {
      reliable: true,
    };

    this.dataChannel = this.myConnection.createDataChannel(
      "myDataChannel",
      dataChannelOptions,
    );

    this.dataChannel.onerror = (error) => {
      console.log("Error:", error);
    };

    this.dataChannel.onmessage = (event) => {
      console.log("Got message:", event.data);
    };
  }

  registerMobileSDP(sdp, key) {
    let options = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    };

    axios
      .post(
        "http://localhost:8080/register-mobile",
        {
          sdp,
          key,
        },
        options,
      )
      .then((response) => {})
      .catch((error) => {});
  }

  registerSDP(sdp) {
    let options = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    };

    axios
      .post("http://localhost:8080/register-desktop", sdp, options)
      .then((response) => {})
      .catch((error) => {});
  }

  send(value) {
    const url = "http://localhost:8080/stream";
    let Http = new XMLHttpRequest();
    Http.open("POST", url);
    Http.setRequestHeader("Content-type", "application/json");
    Http.setRequestHeader("Access-Control-Allow-Origin", "*");
    Http.send(JSON.stringify(value));
  }

  //when another user answers to our offer
  onAnswer(answer) {
    this.myConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  //when we got ice candidate from another user
  onCandidate(candidate) {
    this.myConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }
}

module.exports = WebRTC;
