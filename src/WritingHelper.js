// src/WritingHelper.js
import React, { useState, useEffect, useRef } from 'react';
import './WritingHelper.css';

const WritingHelper = () => {
  const [text, setText] = useState('');
  const [timer, setTimer] = useState(100);
  const [isTyping, setIsTyping] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const intervalRef = useRef(null);
  const textBoxRef = useRef(null);

  useEffect(() => {
    if (isTyping && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => Math.max(prev - 1, 0));
      }, 50); // Decrease timer every 50ms to make it 5 seconds to empty
    }

    return () => clearInterval(intervalRef.current);
  }, [isTyping, timer]);

  useEffect(() => {
    // Focus on the text box when the component mounts
    if (textBoxRef.current) {
      textBoxRef.current.focus();
    }
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
    setTimer(100); // Reset timer to full when typing
    if (!isTyping) {
      setIsTyping(true); // Start the timer only after the first letter is typed
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="writing-helper">
      <h1 className="title">Writing Helper</h1>
      <div className="timer-bar" style={{ width: `${timer}%` }}></div>
      <textarea
        ref={textBoxRef}
        className="writing-box"
        placeholder="Start writing..."
        value={text}
        onChange={handleTextChange}
      />
      <div className="info-icon" onClick={togglePopup}>i</div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={togglePopup}>&times;</span>
            <p>Made by Alex Krentsel.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingHelper;