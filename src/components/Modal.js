import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "5px",
    width: "500px",
    maxWidth: "90%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
  },
};

export default Modal;
