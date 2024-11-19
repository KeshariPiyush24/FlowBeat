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
    const touchStart = useRef({ x: 0, y: 0 })
    const playerRef = useRef(null)
    const MAIN_VIDEO_ID = 'jfKfPfyJRdk'
    const [touchMoved, setTouchMoved] = useState(false)

    useEffect(() => {
        localStorage.setItem('audioPlayerPosition', JSON.stringify(position))
    }, [position])

    // Mouse event handlers
    const handleMouseDown = (e) => {
        dragStart.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        }
        touchStart.current = {
            x: e.clientX,
            y: e.clientY
        }
        setIsDragging(true)
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return

        setPosition({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        })
    }

    const handleMouseUp = (e) => {
        if (isDragging) {
            const dx = e.clientX - touchStart.current.x
            const dy = e.clientY - touchStart.current.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 5) {
                handleTogglePlay()
            }
        }
        setIsDragging(false)
    }

    // Updated touch event handlers
    const handleTouchStart = (e) => {
        const touch = e.touches[0]
        setTouchMoved(false)
        dragStart.current = {
            x: touch.clientX - position.x,
            y: touch.clientY - position.y
        }
        touchStart.current = {
            x: touch.clientX,
            y: touch.clientY
        }
        setIsDragging(true)
    }

    const handleTouchMove = (e) => {
        if (!isDragging) return
        setTouchMoved(true)
        const touch = e.touches[0]
        setPosition({
            x: touch.clientX - dragStart.current.x,
            y: touch.clientY - dragStart.current.y
        })
    }

    const handleTouchEnd = (e) => {
        setIsDragging(false)
        if (!touchMoved) {
            handleTogglePlay()
        }
        setTouchMoved(false)
    }

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            window.addEventListener('touchmove', handleTouchMove, { passive: true })
            window.addEventListener('touchend', handleTouchEnd)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('touchend', handleTouchEnd)
        }
    }, [isDragging])

    useEffect(() => {
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

    // Ensure the player stays within viewport bounds
    useEffect(() => {
        const checkBounds = () => {
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            }
            const playerSize = {
                width: 180,  // Match your CSS values
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

    // Add this function to handle vinyl touch/click
    const handleVinylInteraction = (e) => {
        e.stopPropagation() // Prevent event bubbling to parent
        if (!isDragging) {
            handleTogglePlay()
        }
    }

    useEffect(() => {
        // Handle ad blocker errors
        window.addEventListener('error', (e) => {
            if (e.target.src && (
                e.target.src.includes('googleads') ||
                e.target.src.includes('doubleclick.net')
            )) {
                e.preventDefault()  // Prevent the error from showing in console
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
        >
            <button
                className={`vinyl-record ${isPlaying ? 'spinning' : ''}`}
                onClick={handleVinylInteraction}
            />
            <div id="youtube-player" style={{ display: 'none' }} />
            <div className="track-info">
                <span>Lofi Girl Radio</span>
            </div>
        </div>
    )
}

export default AudioPlayer 