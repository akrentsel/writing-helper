import React, { useState, useEffect, useRef } from 'react';
import './WritingHelper.css';

const WritingHelper = () => {
  const [text, setText] = useState('');
  const [timer, setTimer] = useState(100);
  const [isTyping, setIsTyping] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [isCopied, setIsCopied] = useState(false); // New state for managing button state
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

  useEffect(() => {
    if (timer === 0) {
      setIsEditable(false);
      setShowPopup(true);
    }
  }, [timer]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey && event.key === 's') {
        event.preventDefault();
        console.log('Command + S prevented!'); 
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
    setTimer(100); // Reset timer to full when typing
    if (!isTyping) {
      setIsTyping(true); // Start the timer only after the first letter is typed
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true); // Change button text to "Copied" and disable it
    }, (err) => {
      alert('Failed to copy text: ', err);
    });
  };

  const restartPage = () => {
    window.location.reload();
  };

  return (
    <div className="writing-helper">
      <h1 className="title">Writing Helper</h1>
      <div className="timer-bar" style={{ width: `${timer}%` }}></div>
      <textarea
        ref={textBoxRef}
        className={`writing-box ${!isEditable ? 'faded' : ''}`}
        placeholder="Start writing..."
        value={text}
        onChange={handleTextChange}
        disabled={!isEditable}
      />
      <div className="info-icon">
        i
        <div className="tooltip">keep typing to avoid having your text disappear,<br />made by Alexander Krentsel (procrastinating)</div>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
            <p>Poof, your text is gone!</p>
            <div className="button-container">
              <button
                onClick={copyToClipboard}
                disabled={isCopied}
                className={isCopied ? 'copied' : ''}
              >
                {isCopied ? 'copied' : ' copy '}
              </button>
              <button className="restart-button" onClick={restartPage}>
                again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  };
// &#x21bb; {/* Unicode for the restart icon */}

export default WritingHelper;