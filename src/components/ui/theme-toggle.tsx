import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
	const [theme, setTheme] = useState<'light' | 'dark'>('light');

	useEffect(() => {
		const isDarkMode = document.documentElement.classList.contains('dark');
		setTheme(isDarkMode ? 'dark' : 'light');
	}, []);

	useEffect(() => {
		const isDark = theme === 'dark';
		document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
	}, [theme]);

    const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		
		localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    }

	return (
		<Button variant="ghost" round size="icon" onClick={toggleTheme}>
			{theme === 'dark' ? <Sun /> : <Moon />}
		</Button>
	);
}
