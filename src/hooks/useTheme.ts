import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useEffect } from 'react';

type Theme = 'light' | 'dark';

const themeAtom = atom<Theme>('light');

/**
 * Hook for managing the theme state
 */
export function useTheme() {
	const [theme, setTheme] = useAtom(themeAtom);

    // Set the theme on initial load
    useEffect(() => {
        const currentTheme = localStorage.getItem('theme') as Theme;
        setTheme(currentTheme);
    }, []);

	useEffect(() => {
		const isDark = theme === 'dark';
		document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
	}, [theme]);

    /**
     * Toggle the theme between light and dark
     */
	const toggle = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		set(newTheme);
	};

    /**
     * Set the theme to a specific value
     */
	const set = (theme: Theme) => {
		localStorage.setItem('theme', theme);
		setTheme(theme);
	};

	return { theme, toggle, set };
}
