import { useState, useEffect } from 'react'
import Container from './components/Layout/Container'
import Timer from './components/Timer/Timer'
import AudioPlayer from './components/Audio/AudioPlayer'
import Quote from './components/Quote/Quote'
import ThemeToggle from './components/Theme/ThemeToggle'
import LoadingText from './components/Loading/LoadingText'
import './styles/App.css'

function App() {
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        document.body.classList.add('dark-mode')
        document.documentElement.setAttribute('data-theme', 'dark')
    }, [])

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
                    <div className="quote-section">
                        <Quote onLoaded={() => setIsLoading(false)} />
                        {isLoading && <LoadingText />}
                    </div>
                </div>
                <AudioPlayer isPlaying={isPlaying} />
            </div>
        </div>
    )
}

export default App 