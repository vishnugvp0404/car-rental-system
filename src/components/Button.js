import React from "react";

const Button = ({ text, onClick, style }) => {
  return <button onClick={onClick} style={{ ...styles.button, ...style }}>{text}</button>;
};

const styles = {
  button: {
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default Button;
