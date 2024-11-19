import { useState, useEffect, useRef } from 'react'
import './AudioPlayer.css'

function AudioPlayer({ isPlaying: timerPlaying }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const playerRef = useRef(null)

    useEffect(() => {
        // Load YouTube IFrame API
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('youtube-player', {
                height: '0',
                width: '0',
                videoId: 'jfKfPfyJRdk', // Lofi Girl live stream ID
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
                        // Update isPlaying based on player state
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
        <div className="audio-player">
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