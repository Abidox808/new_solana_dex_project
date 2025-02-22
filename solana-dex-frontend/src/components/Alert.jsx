import React from 'react';
import '../styles/Alert.css';

const Alert = ({ variant = 'info', children }) => {
  return (
    <div className={`alert alert-${variant}`}>
      {children}
    </div>
  );
};

export default Alert;