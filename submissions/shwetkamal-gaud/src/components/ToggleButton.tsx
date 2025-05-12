import { useTheme } from '../context/ThemeContext';

const ToggleButton = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
        >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
    );
}

export default ToggleButton