import { DoorClosed, FolderUp, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { memo } from 'react';
import Settings from './settings';
import { useTheme } from '@/hooks/useTheme';
import { Upload } from './upload/upload';

export type TabName = 'chat' | 'writer';

interface NavbarProps {
	projectId: string
	onTabChange: (tab: TabName) => void;
	value: TabName;
	showThemeToggle?: boolean;
	showSettings?: boolean;
	showBackButton?: boolean;
	showTabs?: boolean;
	showUpload?: boolean;
}

/**
 * Navbar component for the app
 * @param {NavbarProps} props Props for the Navbar component
 */
function Navbar({
	projectId,
	onTabChange,
	value,
	showBackButton = true,
	showSettings = true,
	showTabs = true,
	showUpload = true,
	showThemeToggle = true,
}: NavbarProps) {
	const theme = useTheme();

	return (
		<div className="flex w-full justify-center">
			<div className="w-full flex gap-2">
				{showBackButton && (
					<a href="/projects">
						<Button className="text-neutral-400" variant="ghost" size="icon" round title="Back to projects">
							<DoorClosed />
						</Button>
					</a>
				)}
			</div>

			{showTabs && (
				<Tabs value={value} onValueChange={(value) => onTabChange?.(value as TabName)}>
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
					<Button variant="ghost" size="icon" round onClick={theme.toggle} title="Toggle theme">
						{theme.theme === 'dark' ? <Sun /> : <Moon />}
					</Button>
				)}

				{showUpload && <Upload projectId={projectId} />}

				{showSettings && <Settings projectId={projectId} />}
			</div>
		</div>
	);
}

export default memo(Navbar);
