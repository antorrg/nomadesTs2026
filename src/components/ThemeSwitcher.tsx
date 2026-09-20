import { useTheme } from '../hooks/useTheme';

/** Componente para cambiar entre modo claro y oscuro. */
const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useTheme();

    const getIcon = () => {
        switch (theme) {
            case 'light': return '☀️'; // Sol
            case 'dark': return '🌙';  // Luna
        }
    };

    const getLabel = () => {
        switch (theme) {
            case 'light': return 'Modo Claro';
            case 'dark': return 'Modo Oscuro';
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-outline-secondary"
            aria-label={`Cambiar tema (Actual: ${getLabel()})`}
            title={`Cambiar tema (Actual: ${getLabel()})`}
        >
            <span role="img" aria-label={getLabel()}>{getIcon()}</span>
        </button>
    );
};

export default ThemeSwitcher;
