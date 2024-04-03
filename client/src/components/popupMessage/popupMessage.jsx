import React from 'react';
import PropTypes from 'prop-types';
import './popupMessage.css'; // Assuming you have some CSS file for styling

const PopupMessage = ({ type, message, onOK, onTryAgain }) => {
  return (
    <div className={`popup-message ${type}`}>
      <div className="popup-content">
        <p>{message}</p>
        {type === 'success' && <button onClick={onOK}>OK</button>}
        {type === 'error' && <button onClick={onTryAgain}>Try Again</button>}
      </div>
    </div>
  );
};

PopupMessage.propTypes = {
  type: PropTypes.oneOf(['success', 'error']).isRequired,
  message: PropTypes.string.isRequired,
  onOK: PropTypes.func, // Callback for OK button
  onTryAgain: PropTypes.func, // Callback for Try Again button
};

export default PopupMessage;
