import { useTheme } from '../hooks/useTheme';
import Navbar from './navbar';
import { Toaster } from 'sonner';
import { Chat } from './chat/chat';
import { useState } from 'react';

export default function App() {
	const [currentTab, setCurrentTab] = useState<'chat' | 'writer'>('chat');
	const { theme } = useTheme();

	return (
		<div className="relative flex flex-col items-center justify-center mx-auto min-h-screen overflow-x-hidden bg-background">
			<div className="w-full h-full">
				<div className="z-50 fixed top-4 left-0 px-4 flex w-full justify-space-between">
					<Navbar value={currentTab} onTabChange={setCurrentTab} showSettings={currentTab === 'chat'} />
				</div>

				<Toaster theme={theme} position="bottom-left" />
				
				{currentTab === 'chat' ? <Chat /> : <div className='fixed bottom-0 left-0 bg-amber-300 h-[calc(100vh-64px)] w-full'>sdfsdf</div>}
			</div>
		</div>
	);
}
