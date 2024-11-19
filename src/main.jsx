import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Suspense } from 'react'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Suspense fallback={<div>Loading...</div>}>
            <App />
        </Suspense>
    </React.StrictMode>,
) 