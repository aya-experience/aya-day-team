import React from "react";

export const Notification = ({ text, isVisible }) => (
  <div
    className={`notification custom-notification is-primary z-999 ${
      isVisible ? "active" : ""
    }`}
  >
    {text}
  </div>
);
