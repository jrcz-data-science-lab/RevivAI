import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

export function ThemeToggle() {
	const theme = useTheme();

	return (
		<Button variant="ghost" size="icon" round onClick={theme.toggle} title="Toggle theme">
			{theme.theme === 'dark' ? <Sun /> : <Moon />}
		</Button>
	);
}
