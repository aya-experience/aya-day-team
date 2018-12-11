const axios = require("axios");

let myConnection;
let dataChannel;

// Contains all methods linked to WebRTC connection.

function handleRTCPeerConnection() {
  var configuration = {
    iceServers: [{ urls: "stun:stun.1.google.com:19302" }],
  };

  myConnection = new RTCPeerConnection(configuration);
  console.log("RTCPeerConnection object was created");

  // Catch data channel messages
  myConnection.ondatachannel = function(event) {
    var receiveChannel = event.channel;
    receiveChannel.onmessage = function(event) {
      console.log("ondatachannel message:", event.data);
    };
  };

  // Catch new ICE candidate
  myConnection.onicecandidate = function(event) {
    // when the browser finds an ice candidate we send it to another peer
    if (event.candidate) {
      send({
        type: "candidate",
        message: event.candidate,
      });
    }
  };

  createOffer();
  openDataChannel();
}

// Get local session description and make an offer
function createOffer() {
  myConnection.createOffer(
    function(offer) {
      console.log("Creating and sending SDP.");

      registerSDP(offer);

      console.log("Setting local SDP.");
      myConnection.setLocalDescription(offer);
    },
    function(error) {
      console.log("Error on offer creation. ", error);
    },
  );
}

// Creates a data channel
function openDataChannel() {
  console.log("Opening data channel.");
  var dataChannelOptions = {
    reliable: true,
  };

  dataChannel = myConnection.createDataChannel(
    "myDataChannel",
    dataChannelOptions,
  );

  dataChannel.onerror = function(error) {
    console.log("Error:", error);
  };

  dataChannel.onmessage = function(event) {
    console.log("Got message:", event.data);
  };
}

function registerSDP(sdp) {
  let options = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };

  axios
    .post("http://localhost:8080/register-desktop", sdp, options)
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {});
}

function send(value) {
  const url = "http://localhost:8080/stream";
  let Http = new XMLHttpRequest();
  Http.open("POST", url);
  Http.setRequestHeader("Content-type", "application/json");
  Http.setRequestHeader("Access-Control-Allow-Origin", "*");
  Http.send(JSON.stringify(value));
}

//when another user answers to our offer
function onAnswer(answer) {
  console.log("New Answer.");
  myConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

//when we got ice candidate from another user
function onCandidate(candidate) {
  console.log("New Candidate.");
  myConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

module.exports = {
  handleRTCPeerConnection: handleRTCPeerConnection,
  createOffer: createOffer,
  openDataChannel: openDataChannel,
  send: send,
  onAnswer: onAnswer,
  onCandidate: onCandidate,
};
