import React from "react";

const InputField = ({ type, placeholder, value, onChange }) => {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={styles.input} />;
};

const styles = {
  input: {
    display: "block",
    margin: "10px 0",
    padding: "10px",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
};

export default InputField;
