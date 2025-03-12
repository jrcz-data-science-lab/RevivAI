import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { memo } from 'react';
import Settings from './settings';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'motion/react';

type TabName = 'chat' | 'writer';

interface NavbarProps {
	onTabChange?: (tab: TabName) => void;
	value?: TabName;
	showThemeToggle?: boolean;
	showSettings?: boolean;
	showBackButton?: boolean;
	showTabs?: boolean;
}

function Navbar({ onTabChange, value, showBackButton = true, showSettings = true, showTabs = true, showThemeToggle = true }: NavbarProps) {
	const { theme, toggle } = useTheme();

	return (
		<div
			className="flex w-full justify-center"
		>
			<div className="w-full flex gap-2">
				{showBackButton && (
					<Button className="text-neutral-400" variant="ghost" round asChild>
						<a href="/projects">
							<ArrowLeft />
							Go back
						</a>
					</Button>
				)}
			</div>

			{showTabs && (
				<Tabs value={value} onValueChange={(value) => onTabChange && onTabChange(value as TabName)}>
					<TabsList className="rounded-full">
						<TabsTrigger value="chat" className="w-20 rounded-full">
							Chat
						</TabsTrigger>
						<TabsTrigger value="writer" className="w-20 rounded-full">
							Writer
						</TabsTrigger>
					</TabsList>
				</Tabs>
			)}

			<div className="w-full flex gap-2 justify-end">
				{showThemeToggle && (
					<Button variant="ghost" round size="icon" onClick={toggle}>
						{theme === 'dark' ? <Sun /> : <Moon />}
					</Button>
				)}

				{showSettings && <Settings />}
			</div>
		</div>
	);
}

export default memo(Navbar);