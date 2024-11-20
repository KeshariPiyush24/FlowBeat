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
    const startPos = useRef({ x: 0, y: 0 })
    const playerRef = useRef(null)
    const MAIN_VIDEO_ID = 'jfKfPfyJRdk'
    const moveThreshold = 10 // pixels to consider as drag

    useEffect(() => {
        localStorage.setItem('audioPlayerPosition', JSON.stringify(position))
    }, [position])

    const handleStart = (clientX, clientY) => {
        event.preventDefault();
        startPos.current = { x: clientX, y: clientY }
        dragStart.current = {
            x: clientX - position.x,
            y: clientY - position.y
        }
        setIsDragging(true)
    }

    const handleMove = (clientX, clientY) => {
        if (!isDragging) return

        const deltaX = Math.abs(clientX - startPos.current.x)
        const deltaY = Math.abs(clientY - startPos.current.y)

        if (deltaX > moveThreshold || deltaY > moveThreshold) {
            setPosition({
                x: clientX - dragStart.current.x,
                y: clientY - dragStart.current.y
            })
        }
    }

    const handleEnd = (clientX, clientY, isTouch = false) => {
        if (isDragging) {
            const deltaX = Math.abs(clientX - startPos.current.x)
            const deltaY = Math.abs(clientY - startPos.current.y)

            const touchThreshold = isTouch ? 15 : moveThreshold;

            if (deltaX < touchThreshold && deltaY < touchThreshold) {
                setTimeout(() => {
                    handleTogglePlay();
                }, isTouch ? 50 : 0);
            }
        }
        setIsDragging(false)
    }

    // Mouse event handlers
    const handleMouseDown = (e) => {
        handleStart(e.clientX, e.clientY)
    }

    const handleMouseMove = (e) => {
        handleMove(e.clientX, e.clientY)
    }

    const handleMouseUp = (e) => {
        handleEnd(e.clientX, e.clientY)
    }

    // Touch event handlers with improved handling
    const handleTouchStart = (e) => {
        e.preventDefault();
        const touch = e.touches[0]
        handleStart(touch.clientX, touch.clientY)
    }

    const handleTouchMove = (e) => {
        e.preventDefault();
        if (!isDragging) return;
        const touch = e.touches[0]
        handleMove(touch.clientX, touch.clientY)
    }

    const handleTouchEnd = (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0]
        handleEnd(touch.clientX, touch.clientY, true)
    }

    // Add touch cancel handler
    const handleTouchCancel = (e) => {
        setIsDragging(false);
    }

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            window.addEventListener('touchmove', handleTouchMove, { passive: false })
            window.addEventListener('touchend', handleTouchEnd)
            window.addEventListener('touchcancel', handleTouchCancel)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('touchend', handleTouchEnd)
            window.removeEventListener('touchcancel', handleTouchCancel)
        }
    }, [isDragging])

    useEffect(() => {
        // Load YouTube API
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

        window.onYouTubeIframeAPIReady = () => {
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
                    playsinline: 1,
                    origin: window.location.origin,
                    enablejsapi: 1,
                    rel: 0,
                    loop: 1,
                    playlist: MAIN_VIDEO_ID,
                    // Premium-specific parameters
                    premium: 1,
                    iv_load_policy: 3, // Disable annotations
                    widget_referrer: window.location.href
                },
                events: {
                    onReady: async (event) => {
                        event.target.setVolume(70);

                        // Check if user has Premium
                        try {
                            const isPremium = await checkPremiumStatus();
                            if (isPremium) {
                                // Enable background playback for Premium users
                                document.addEventListener('visibilitychange', () => {
                                    if (document.hidden && isPlaying) {
                                        event.target.playVideo();
                                    }
                                });
                            }

                            if (timerPlaying) {
                                event.target.playVideo();
                                setIsPlaying(true);
                            }
                        } catch (error) {
                            console.error('Error checking Premium status:', error);
                        }
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                        } else if (event.data === window.YT.PlayerState.PAUSED) {
                            setIsPlaying(false);
                        } else if (event.data === window.YT.PlayerState.ENDED) {
                            // Automatically replay when ended
                            event.target.playVideo();
                        }
                    },
                    onError: (event) => {
                        console.error('YouTube Player Error:', event.data);
                        // Attempt to recover from errors
                        if (playerRef.current) {
                            playerRef.current.playVideo();
                        }
                    }
                }
            })
        }

        // Function to check Premium status
        const checkPremiumStatus = async () => {
            if (playerRef.current && playerRef.current.getOptions) {
                const features = await playerRef.current.getOptions();
                // Premium users have access to additional features
                return features.includes('premium');
            }
            return false;
        };

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

    // Ensure the player stays within viewport bounds
    useEffect(() => {
        const checkBounds = () => {
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            }
            const playerSize = {
                width: 180,
                height: 180
            }

            setPosition(prev => ({
                x: Math.min(Math.max(prev.x, 0), viewport.width - playerSize.width),
                y: Math.min(Math.max(prev.y, 0), viewport.height - playerSize.height)
            }))
        }

        window.addEventListener('resize', checkBounds)
        checkBounds()

        return () => window.removeEventListener('resize', checkBounds)
    }, [])

    useEffect(() => {
        window.addEventListener('error', (e) => {
            if (e.target.src && (
                e.target.src.includes('googleads') ||
                e.target.src.includes('doubleclick.net')
            )) {
                e.preventDefault()
            }
        }, true)
    }, [])

    return (
        <div
            className="audio-player"
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
        >
            <button
                className={`vinyl-record ${isPlaying ? 'spinning' : ''}`}
            />
            <div id="youtube-player" style={{ display: 'none' }} />
            <div className="track-info">
                <span>Lofi Girl Radio</span>
            </div>
        </div>
    )
}

export default AudioPlayer 