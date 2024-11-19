import './Container.css'

function Container({ children }) {
    return (
        <main className="main-container">
            {children}
        </main>
    )
}

export default Container 