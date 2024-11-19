import './ThemeToggle.css'

function ThemeToggle({ isDarkMode, toggleTheme }) {
    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? '☀️' : '🌙'}
        </button>
    )
}

export default ThemeToggle 