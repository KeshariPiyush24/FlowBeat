import { useState, useEffect } from 'react'
import './Quote.css'

function Quote() {
    const [quote, setQuote] = useState('')
    const [author, setAuthor] = useState('')

    const categories = [
        'inspirational',
        'success',
        'motivation',
        'wisdom',
        'happiness'
    ]

    const fetchQuote = async () => {
        try {
            // Randomly select a category
            const randomCategory = categories[Math.floor(Math.random() * categories.length)]
            const response = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${randomCategory}`, {
                headers: {
                    'X-Api-Key': 'TGQUudyDo5q5bxRADwfW7Q==xITW3gNQCceu48eY'
                }
            })
            const [data] = await response.json()
            setQuote(data.quote)
            setAuthor(data.author)
        } catch (error) {
            console.error('Error fetching quote:', error)
            // Fallback motivational quotes if API fails
            const fallbackQuotes = [
                { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
                { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
                { quote: "The future depends on what you do today.", author: "Mahatma Gandhi" }
            ]
            const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
            setQuote(randomQuote.quote)
            setAuthor(randomQuote.author)
        }
    }

    useEffect(() => {
        fetchQuote()
        // Fetch new quote every 30 minutes (1800000 milliseconds)
        const interval = setInterval(fetchQuote, 1800000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="quote">
            <p className="quote-text">{quote}</p>
            {author && <p className="quote-author">- {author}</p>}
        </div>
    )
}

export default Quote 