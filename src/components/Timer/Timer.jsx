import { useState, useEffect, useRef } from 'react'
import './Timer.css'

const TIMER_PRESETS = {
    thirtyMin: { time: 30 * 60, label: '30 mins' },
    oneHour: { time: 60 * 60, label: '1 hour' },
    twoHours: { time: 120 * 60, label: '2 hours' },
    infinity: { time: 359999, label: '∞' },
    custom: { time: 0, label: 'Custom' }
};

function Timer({ onPlayPause }) {
    const [time, setTime] = useState(TIMER_PRESETS.thirtyMin.time)
    const [isActive, setIsActive] = useState(false)
    const [timerMode, setTimerMode] = useState('thirtyMin')
    const [showCustom, setShowCustom] = useState(false)
    const [customTime, setCustomTime] = useState({ hours: 0, minutes: 0 })
    const audioRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)

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
        setTime(TIMER_PRESETS[mode].time)
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

        if (TIMER_PRESETS[timerMode]) {
            setTime(TIMER_PRESETS[timerMode].time);
        } else if (timerMode === 'custom') {
            const totalSeconds =
                (parseInt(customTime.hours || 0) * 3600) +
                (parseInt(customTime.minutes || 0) * 60);
            setTime(totalSeconds);
        } else {
            setTime(TIMER_PRESETS.thirtyMin.time);
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

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    return (
        <div
            className="timer-container"
            onTouchEnd={handleTouchEnd}
        >
            <div className="timer">
                <div className="timer-modes">
                    {Object.entries(TIMER_PRESETS).map(([key, preset]) => (
                        <button
                            key={key}
                            className={`mode-button ${timerMode === key ? 'active' : ''}`}
                            onClick={() => handleModeChange(key)}
                        >
                            {preset.label}
                        </button>
                    ))}
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
                            setTime(TIMER_PRESETS.thirtyMin.time);
                            setIsActive(false);
                            setShowCustom(false);
                            setTimerMode('thirtyMin');
                        }}
                    >Reset</button>
                </div>
            </div>
        </div>
    )
}

export default Timer 