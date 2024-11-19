import { useState, useEffect } from 'react';
import './LoadingText.css';

const catchyLines = [
    "Brewing some inspiration...",
    "Finding the perfect words...",
    "Channeling positive vibes...",
    "Gathering wisdom...",
    "Loading motivation.exe...",
    "Preparing your daily boost...",
];

const LoadingText = () => {
    const [currentLine, setCurrentLine] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLine((prev) => (prev + 1) % catchyLines.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-container">
            <p className="loading-text">{catchyLines[currentLine]}</p>
            <div className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </div>
        </div>
    );
};

export default LoadingText; 