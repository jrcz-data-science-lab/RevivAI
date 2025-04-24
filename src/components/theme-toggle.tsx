import { useTheme } from '@/hooks/useTheme';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
	const theme = useTheme();

	return (
		<Button variant="ghost" size="icon" round onClick={theme.toggle} title="Toggle theme">
			{theme.theme === 'dark' ? <Sun /> : <Moon />}
		</Button>
	);
}
