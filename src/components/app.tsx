import { useTheme } from '@/hooks/useTheme';
import Navbar, { type TabName } from './navbar';
import { Toaster } from 'sonner';
import { Chat } from './chat/chat';
import { Writer } from './writer/writer';
import { useHashRouter } from '@/hooks/useHashRouter';
import { useDb } from '@/hooks/useDb';

interface AppProps {
	projectId: string;
}

export default function App({ projectId }: AppProps) {
	const { db } = useDb(projectId);
	const { theme } = useTheme();
	const { hash, setHash } = useHashRouter('chat');

	if (!projectId) {
		return <div className="text-muted-foreground flex gap-2">No projects specified.</div>;
	}

	// Return the app screen based on the hash value
	const getAppScreen = (page: string) => {
		if (page === 'chat') return <Chat />;
		if (page === 'writer') return <Writer db={db} />;
		return <div className="text-muted-foreground w-full text-center">This page doesn't exist</div>;
	};

	return (
		<div className="relative flex items-center justify-center min-w-screen min-h-screen overflow-x-hidden bg-background">
			<div className="w-full h-full">
				<div className="z-50 fixed top-4 left-0 px-4 flex w-full justify-space-between">
					<Navbar value={hash as TabName} onTabChange={setHash} showSettings={hash === 'chat'} />
				</div>

				<Toaster theme={theme} position="bottom-left" />

				{getAppScreen(hash)}
			</div>
		</div>
	);
}
