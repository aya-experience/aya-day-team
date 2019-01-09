import React, { Component } from "react";
import qrcode from "qrcode-generator";

class QR extends Component {
  constructor(props) {
    super(props);

    this.state = {
      QR: "",
    };
  }

  /**
   * On mount, generate the QR code with the URL prop
   */
  componentDidMount() {
    this.generateQRCode(this.props.URL);
  }

  /**
   * Generates a QR code in Data URL format with the given URL parameter
   * @param {String} URL - The link for the QR code
   */
  generateQRCode(URL) {
    const qr = qrcode(10, "L");
    qr.addData(URL);
    qr.make();

    this.setState({
      QR: qr.createDataURL(),
    });
  }

  render() {
    return <img src={this.state.QR} />;
  }
}

export default QR;
