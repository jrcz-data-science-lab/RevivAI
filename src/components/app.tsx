import { useTheme } from '../hooks/useTheme';
import Navbar from './navbar';
import { Toaster } from 'sonner';
import { Chat } from './chat/chat';
import { useState } from 'react';
import { Writer } from './writer/writer';

export default function App() {
	const [currentTab, setCurrentTab] = useState<'chat' | 'writer'>('writer');
	const { theme } = useTheme();

	return (
		<div className="relative flex items-center justify-center min-w-screen min-h-screen overflow-x-hidden bg-background">
			<div className="w-full h-full">
				<div className="z-50 fixed top-4 left-0 px-4 flex w-full justify-space-between">
					<Navbar value={currentTab} onTabChange={setCurrentTab} showSettings={currentTab === 'chat'} />
				</div>

				<Toaster theme={theme} position="bottom-left" />

				{currentTab === 'chat' ? <Chat /> : <Writer />}
			</div>
		</div>
	);
}
