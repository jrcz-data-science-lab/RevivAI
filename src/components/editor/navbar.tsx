import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { memo } from 'react';
import Settings from './settings';
import { useTheme } from '@/hooks/useTheme';

function Navbar() {
	const { theme, toggle } = useTheme();
	
    return (
		<div className="flex w-full justify-center">
			<div className="w-full flex gap-2">
				<Button className="text-neutral-400" variant="ghost" round asChild>
					<a href="/">
						<ArrowLeft />
						Go back
					</a>
				</Button>
			</div>

			<Tabs defaultValue="account">
				<TabsList className="rounded-full">
					<TabsTrigger value="account" className="w-20 rounded-full">
						Chat
					</TabsTrigger>
					<TabsTrigger value="password" className="w-20 rounded-full">
						Writer
					</TabsTrigger>
				</TabsList>
			</Tabs>

			<div className="w-full flex gap-2 justify-end">
				<Button variant="ghost" round size="icon" onClick={toggle}>
					{theme === 'dark' ? <Sun /> : <Moon />}
				</Button>

				<Settings />
			</div>
		</div>
	);
}

export default memo(Navbar);