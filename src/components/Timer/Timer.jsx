import { useState, useEffect } from 'react'
import './Timer.css'

function Timer({ onPlayPause }) {
    const [time, setTime] = useState(30 * 60)
    const [isActive, setIsActive] = useState(false)
    const [timerMode, setTimerMode] = useState('30')
    const [showCustom, setShowCustom] = useState(false)
    const [customTime, setCustomTime] = useState({ hours: 0, minutes: 0 })

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

    return (
        <div className="timer">
            <div className="timer-modes">
                <button className={`mode-button ${timerMode === '30' ? 'active' : ''}`}
                    onClick={() => handleModeChange('30')}>30m</button>
                <button className={`mode-button ${timerMode === '60' ? 'active' : ''}`}
                    onClick={() => handleModeChange('60')}>60m</button>
                <button className={`mode-button ${timerMode === '100' ? 'active' : ''}`}
                    onClick={() => handleModeChange('100')}>100m</button>
                <button className={`mode-button ${timerMode === 'infinity' ? 'active' : ''}`}
                    onClick={() => handleModeChange('infinity')}>∞</button>
                <button className={`mode-button ${timerMode === 'custom' ? 'active' : ''}`}
                    onClick={() => handleModeChange('custom')}>Custom</button>
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
                <button className="control-button reset" onClick={() => setTime(30 * 60)}>Reset</button>
            </div>
        </div>
    )
}

export default Timer 