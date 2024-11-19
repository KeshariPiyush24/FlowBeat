import { useState } from 'react'
import Container from './components/Layout/Container'
import Timer from './components/Timer/Timer'
import AudioPlayer from './components/Audio/AudioPlayer'
import Quote from './components/Quote/Quote'
import ThemeToggle from './components/Theme/ThemeToggle'
import './styles/App.css'

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode)
        document.body.classList.toggle('dark-mode')
    }

    const handlePlayPause = (isActive) => {
        setIsPlaying(isActive)
    }

    return (
        <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <div className="content-wrapper">
                <div className="main-section">
                    <Timer onPlayPause={handlePlayPause} />
                    <Quote />
                </div>
                <AudioPlayer isPlaying={isPlaying} />
            </div>
        </div>
    )
}

export default App 