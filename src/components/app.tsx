import { useTheme } from '@/hooks/useTheme';
import Navbar, { type TabName } from './navbar';
import { Toaster } from 'sonner';
import { Chat } from './chat/chat';
import { Writer } from './writer/writer';
import { useHashRouter } from '@/hooks/useHashRouter';
import { useDb } from '@/hooks/useDb';
import { useProjects } from '@/hooks/useProjects';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface AppProps {
	projectId: string;
}

export default function App({ projectId }: AppProps) {
	const { db } = useDb(projectId);
	const { theme } = useTheme();
	const { projectExists } = useProjects();
	const { hash, setHash } = useHashRouter('chat');

	// If no project ID is provided or the project does not exist, show a message
	if (!projectId || !projectExists(projectId)) {
		return (
			<motion.div
				initial={{ opacity: 0, translateY: 16 }}
				animate={{ opacity: 1, translateY: 0 }}
				transition={{ duration: 0.1, delay: 1 }}
				className="text-muted-foreground flex flex-col gap-4 justify-center items-center"
			>
				<div className="text-muted-foreground w-full text-center">This project doesn't exist.</div>
				<a href="/projects">
					<Button size="sm" variant="outline">
						Back to projects
					</Button>
				</a>
			</motion.div>
		);
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
					<Navbar value={hash as TabName} onTabChange={setHash} />
				</div>

				<Toaster theme={theme} position="bottom-left" />

				{getAppScreen(hash)}
			</div>
		</div>
	);
}
