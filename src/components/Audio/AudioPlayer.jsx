import { useState, useRef, useEffect } from 'react'
import './AudioPlayer.css'

function AudioPlayer({ isPlaying: timerPlaying }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState(0)
    const audioRef = useRef(null)

    const tracks = [
        { title: 'Lofi Study', url: '/assets/lofi-tracks/study.mp3' },
        { title: 'Chill Beats', url: '/assets/lofi-tracks/chill.mp3' },
        { title: 'Focus Mode', url: '/assets/lofi-tracks/focus.mp3' }
    ]

    useEffect(() => {
        if (timerPlaying) {
            audioRef.current.play()
            setIsPlaying(true)
        } else {
            audioRef.current.pause()
            setIsPlaying(false)
        }
    }, [timerPlaying])

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    return (
        <div className="audio-player">
            <button
                className={`vinyl-record ${isPlaying ? 'spinning' : ''}`}
                onClick={togglePlay}
            />
            <audio
                ref={audioRef}
                src={tracks[currentTrack].url}
                onEnded={() => setCurrentTrack((prev) => (prev + 1) % tracks.length)}
            />
            <div className="track-info">
                <span>{tracks[currentTrack].title}</span>
            </div>
        </div>
    )
}

export default AudioPlayer 