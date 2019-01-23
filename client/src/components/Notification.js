import React from 'react';

const Notification = ({ text, isVisible }) => (
  <div
    className={`notification custom-notification is-primary z-999 ${
      isVisible ? 'active' : ''
    }`}
  >
    {text}
  </div>
);

export default Notification;
