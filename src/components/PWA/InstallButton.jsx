import { useState, useEffect } from 'react'
import './InstallButton.css'

function InstallButton() {
    const [showInstall, setShowInstall] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = useState(null)

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setShowInstall(true)
        }

        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleClick = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const result = await deferredPrompt.userChoice

        if (result.outcome === 'accepted') {
            setShowInstall(false)
        }
        setDeferredPrompt(null)
    }

    if (!showInstall) return null

    return (
        <button
            className="install-button"
            onClick={handleClick}
            aria-label="Install app"
        >
            ↓
        </button>
    )
}

export default InstallButton 