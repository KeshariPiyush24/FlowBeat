import { useState, useEffect, useRef } from 'react'
import './Quote.css'

function Quote({ onLoaded }) {
    const [quote, setQuote] = useState('')
    const [author, setAuthor] = useState('')
    const isFirstRender = useRef(true)

    const categories = [
        'inspirational',
        'success',
        'motivation',
        'wisdom',
        'happiness'
    ]

    const fetchQuote = async () => {
        try {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)]
            const response = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${randomCategory}`, {
                headers: {
                    'X-Api-Key': 'TGQUudyDo5q5bxRADwfW7Q==xITW3gNQCceu48eY'
                }
            })
            const [data] = await response.json()
            setQuote(data.quote)
            setAuthor(data.author)
            onLoaded()
        } catch (error) {
            console.error('Error fetching quote:', error)
            const fallbackQuotes = [
                { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
                { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
                { quote: "The future depends on what you do today.", author: "Mahatma Gandhi" }
            ]
            const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
            setQuote(randomQuote.quote)
            setAuthor(randomQuote.author)
            onLoaded()
        }
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            fetchQuote()
            const interval = setInterval(fetchQuote, 1800000)
            return () => clearInterval(interval)
        }
    }, [])

    return (
        <div className="quote">
            <p className="quote-text">{quote}</p>
            {author && <p className="quote-author">- {author}</p>}
        </div>
    )
}

export default Quote 