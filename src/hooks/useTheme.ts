import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

export type Theme = 'light' | 'dark';

const initialTheme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
const themeAtom = atom<Theme>(initialTheme);

/**
 * Hook for managing the theme state
 */
export function useTheme() {
	const [theme, setTheme] = useAtom(themeAtom);

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
