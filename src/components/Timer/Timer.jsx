import { useState, useEffect, useRef } from 'react'
import './Timer.css'

function Timer({ onPlayPause }) {
    const [time, setTime] = useState(30 * 60)
    const [isActive, setIsActive] = useState(false)
    const [timerMode, setTimerMode] = useState('30')
    const [showCustom, setShowCustom] = useState(false)
    const [customTime, setCustomTime] = useState({ hours: 0, minutes: 0 })
    const audioRef = useRef(null)

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0')
        }
    }

    useEffect(() => {
        let interval
        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime(time => time - 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isActive, time])

    const handleModeChange = (mode) => {
        setTimerMode(mode)
        if (mode === 'custom') {
            setShowCustom(true)
            return
        }
        setShowCustom(false)
        if (mode === 'infinity') {
            setTime(359999)
        } else {
            setTime(parseInt(mode) * 60)
        }
        setIsActive(false)
    }

    const handleCustomSubmit = () => {
        const totalSeconds =
            (parseInt(customTime.hours || 0) * 3600) +
            (parseInt(customTime.minutes || 0) * 60)
        setTime(totalSeconds)
        setShowCustom(false)
        setTimerMode('custom')
    }

    const toggleTimer = () => {
        if (showCustom) {
            handleCustomSubmit()
        }
        setIsActive(!isActive)
        onPlayPause(!isActive)
    }

    const formattedTime = formatTime(time)

    const handleTimerComplete = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        setIsActive(false);
        setTime(0);

        switch (timerMode) {
            case '30':
                setTime(30 * 60);
                break;
            case '60':
                setTime(60 * 60);
                break;
            case '100':
                setTime(100 * 60);
                break;
            case 'custom':
                const totalSeconds =
                    (parseInt(customTime.hours || 0) * 3600) +
                    (parseInt(customTime.minutes || 0) * 60);
                setTime(totalSeconds);
                break;
            default:
                setTime(30 * 60);
        }

        if (Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
                body: 'Time to take a break!',
            });
        }
    };

    useEffect(() => {
        let interval;
        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 1) {
                        handleTimerComplete();
                        clearInterval(interval);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isActive, timerMode]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    return (
        <div className="timer">
            <div className="timer-modes">
                <button
                    className={`mode-button ${timerMode === '30' ? 'active' : ''}`}
                    onClick={() => handleModeChange('30')}
                >30m</button>
                <button
                    className={`mode-button ${timerMode === '60' ? 'active' : ''}`}
                    onClick={() => handleModeChange('60')}
                >60m</button>
                <button
                    className={`mode-button ${timerMode === '100' ? 'active' : ''}`}
                    onClick={() => handleModeChange('100')}
                >100m</button>
                <button
                    className={`mode-button ${timerMode === 'infinity' ? 'active' : ''}`}
                    onClick={() => handleModeChange('infinity')}
                >∞</button>
                <button
                    className={`mode-button ${timerMode === 'custom' && !showCustom ? 'active' : ''}`}
                    onClick={() => handleModeChange('custom')}
                >Custom</button>
            </div>

            {showCustom ? (
                <div className="custom-time-input">
                    <input
                        type="number"
                        placeholder="HH"
                        min="0"
                        max="99"
                        className="no-spinners"
                        onChange={e => setCustomTime({ ...customTime, hours: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="MM"
                        min="0"
                        max="59"
                        className="no-spinners"
                        onChange={e => setCustomTime({ ...customTime, minutes: e.target.value })}
                    />
                </div>
            ) : (
                <div className="digital-clock">
                    <span className="time-unit">{formattedTime.hours}</span>
                    <span className="separator">:</span>
                    <span className="time-unit">{formattedTime.minutes}</span>
                    <span className="separator">:</span>
                    <span className="time-unit">{formattedTime.seconds}</span>
                </div>
            )}

            <div className="timer-controls">
                <button className="control-button" onClick={toggleTimer}>
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button
                    className="control-button reset"
                    onClick={() => {
                        setTime(30 * 60);
                        setIsActive(false);
                        setShowCustom(false);
                        setTimerMode('30');
                    }}
                >Reset</button>
            </div>
        </div>
    )
}

export default Timer 