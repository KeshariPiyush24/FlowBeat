import { useState, useEffect, useRef } from 'react'
import './AudioPlayer.css'

function AudioPlayer({ isPlaying: timerPlaying }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const playerRef = useRef(null)
    const backupPlayerRef = useRef(null)
    const MAIN_VIDEO_ID = 'jfKfPfyJRdk' // Lofi Girl Hip Hop stream ID
    const BACKUP_VIDEO_ID = 'HuFYqnbVbzY' // Lofi Girl Jazz stream ID

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
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            const videoUrl = event.target.getVideoUrl()
                            if (!videoUrl.includes(MAIN_VIDEO_ID)) {
                                // If it's an ad, mute main player and play backup
                                event.target.mute()
                                if (backupPlayerRef.current) {
                                    backupPlayerRef.current.unMute()
                                    backupPlayerRef.current.playVideo()
                                }
                            } else {
                                // If main video is playing, mute backup
                                event.target.unMute()
                                if (backupPlayerRef.current) {
                                    backupPlayerRef.current.mute()
                                    backupPlayerRef.current.pauseVideo()
                                }
                            }
                        }
                        setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
                    }
                }
            })

            // Initialize backup player
            backupPlayerRef.current = new window.YT.Player('backup-player', {
                height: '0',
                width: '0',
                videoId: BACKUP_VIDEO_ID,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    playsinline: 1
                }
            })
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy()
            }
            if (backupPlayerRef.current) {
                backupPlayerRef.current.destroy()
            }
        }
    }, [])

    useEffect(() => {
        if (playerRef.current && playerRef.current.getPlayerState) {
            if (timerPlaying) {
                playerRef.current.playVideo()
            } else {
                playerRef.current.pauseVideo()
                if (backupPlayerRef.current) {
                    backupPlayerRef.current.pauseVideo()
                }
            }
        }
    }, [timerPlaying])

    const handleTogglePlay = () => {
        if (!playerRef.current || !playerRef.current.getPlayerState) return

        if (isPlaying) {
            playerRef.current.pauseVideo()
            if (backupPlayerRef.current) {
                backupPlayerRef.current.pauseVideo()
            }
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
            <div id="backup-player" style={{ display: 'none' }} />
            <div className="track-info">
                <span>Lofi Girl Radio</span>
            </div>
        </div>
    )
}

export default AudioPlayer 