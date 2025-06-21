import { DoorClosed, FolderUp, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { memo } from 'react';
import { isSettingsOpenedAtom } from './settings';
import { isUploadOpenAtom } from './upload/upload';
import { ThemeToggle } from './theme-toggle';
import { useSetAtom } from 'jotai';

export type TabName = 'chat' | 'writer';

interface NavbarProps {
	onTabChange: (tab: TabName) => void;
	value: TabName;
}

/**
 * Navbar component for the app
 * @param {NavbarProps} props Props for the Navbar component
 */
function Navbar({ onTabChange, value }: NavbarProps) {
	const setIsSettingsOpen = useSetAtom(isSettingsOpenedAtom);
	const setIsUploadOpen = useSetAtom(isUploadOpenAtom);

	return (
		<div className="flex w-full justify-center">
			<div className="w-full flex gap-2">
				<a href="/">
					<Button className="text-neutral-400" variant="ghost" size="icon" round title="Back to projects">
						<DoorClosed />
					</Button>
				</a>
			</div>

			<Tabs
				value={value}
				onValueChange={(value) => onTabChange?.(value as TabName)}
				className="shadow-sm shadow-background rounded-full"
			>
				<TabsList className="rounded-full" role="tablist" aria-label="Main navigation">
					<TabsTrigger
						value="chat"
						className="w-20 rounded-full"
						title="Chat with Codebase"
						role="tab"
						aria-label="Chat with Codebase"
						aria-selected={value === 'chat'}
					>
						Chat
					</TabsTrigger>
					<TabsTrigger
						value="writer"
						className="w-20 rounded-full"
						title="Write Documentation"
						role="tab"
						aria-label="Write Documentation"
						aria-selected={value === 'writer'}
					>
						Writer
					</TabsTrigger>
				</TabsList>
			</Tabs>

			<div className="w-full flex gap-2 justify-end">
				<ThemeToggle />

				<Button title="Upload code files" variant="ghost" size="icon" round onClick={() => setIsUploadOpen(true)}>
					<FolderUp />
				</Button>

				<Button title="Settings" variant="ghost" round size="icon" onClick={() => setIsSettingsOpen(true)}>
					<SlidersHorizontal />
				</Button>
			</div>
		</div>
	);
}

export default memo(Navbar);
