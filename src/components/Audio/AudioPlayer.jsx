import { useState, useEffect, useRef } from 'react'
import './AudioPlayer.css'

function AudioPlayer({ isPlaying: timerPlaying }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [position, setPosition] = useState(() => {
        const saved = localStorage.getItem('audioPlayerPosition')
        return saved ? JSON.parse(saved) : { x: 0, y: 0 }
    })
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef({ x: 0, y: 0 })
    const playerRef = useRef(null)
    const MAIN_VIDEO_ID = 'jfKfPfyJRdk'

    // Save position to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('audioPlayerPosition', JSON.stringify(position))
    }, [position])

    const handleMouseDown = (e) => {
        setIsDragging(true)
        dragStart.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        }
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return

        setPosition({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging])

    useEffect(() => {
        // Load YouTube IFrame API with HTTPS
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

        window.onYouTubeIframeAPIReady = () => {
            // Initialize main player
            playerRef.current = new window.YT.Player('youtube-player', {
                height: '0',
                width: '0',
                videoId: MAIN_VIDEO_ID,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    playsinline: 1
                },
                events: {
                    onReady: (event) => {
                        if (timerPlaying) {
                            event.target.playVideo()
                            setIsPlaying(true)
                        }
                    },
                    onStateChange: (event) => {
                        setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
                    }
                }
            })
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy()
            }
        }
    }, [])

    useEffect(() => {
        if (playerRef.current && playerRef.current.getPlayerState) {
            if (timerPlaying) {
                playerRef.current.playVideo()
            } else {
                playerRef.current.pauseVideo()
            }
        }
    }, [timerPlaying])

    const handleTogglePlay = () => {
        if (!playerRef.current || !playerRef.current.getPlayerState) return

        if (isPlaying) {
            playerRef.current.pauseVideo()
        } else {
            playerRef.current.playVideo()
        }
        setIsPlaying(!isPlaying)
    }

    return (
        <div
            className="audio-player"
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
        >
            <button
                className={`vinyl-record ${isPlaying ? 'spinning' : ''}`}
                onClick={handleTogglePlay}
            />
            <div id="youtube-player" style={{ display: 'none' }} />
            <div className="track-info">
                <span>Lofi Girl Radio</span>
            </div>
        </div>
    )
}

export default AudioPlayer 