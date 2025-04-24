import { useTheme } from '@/hooks/useTheme';
import Navbar, { type TabName } from './navbar';
import { Toaster } from './ui/toaster';
import { Chat } from './chat/chat';
import { Writer } from './writer/writer';
import { useHashRouter } from '@/hooks/useHashRouter';
import { useDb } from '@/hooks/useDb';
import { currentProjectIdAtom, useProjects } from '@/hooks/useProjects';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useModel } from '@/hooks/useModel';
import { useEffect } from 'react';
import { useHydrateAtoms } from 'jotai/utils';

interface AppProps {
	projectId: string;
}

/**
 * Main application component
 * @param projectId The ID of the current project
 */
export default function App({ projectId }: AppProps) {
	// Hydrate the current project ID, specifying initial values
	useHydrateAtoms(new Map([[currentProjectIdAtom, projectId]]));

	const { theme } = useTheme();
	const { db } = useDb(projectId);
	const { model } = useModel();
	const { isProjectExists } = useProjects();
	const { hash, setHash } = useHashRouter('chat');

	// Hide loading spinner
	useEffect(() => {
		const loadingSpinner = document.querySelector('#loading-spinner');
		if (!loadingSpinner) return;

		loadingSpinner.classList.add('opacity-0', 'scale-125');
		setTimeout(() => loadingSpinner.remove(), 1000);
	}, []);

	// If no project ID is provided or the project does not exist, show a message
	if (!projectId || !isProjectExists(projectId)) {
		return (
			<motion.div
				initial={{ opacity: 0, translateY: 16 }}
				animate={{ opacity: 1, translateY: 0 }}
				transition={{ duration: 0.1, delay: 1 }}
				className="text-muted-foreground flex flex-col gap-4 justify-center items-center"
			>
				<div className="text-muted-foreground w-full text-center">This project doesn't exist.</div>
				<a href="/">
					<Button size="sm" variant="outline">
						Back to projects
					</Button>
				</a>
			</motion.div>
		);
	}
	// If no model is selected, redirect to setup
	if (!model) {
		return (
			<motion.div
				initial={{ opacity: 0, translateY: 16 }}
				animate={{ opacity: 1, translateY: 0 }}
				transition={{ duration: 0.1, delay: 1 }}
				className="text-muted-foreground flex flex-col gap-4 justify-center items-center"
			>
				<div className="text-muted-foreground w-full text-center">LLM provider is not specified.</div>
				<a href={`/setup?redirectToProject=${projectId}`}>
					<Button size="sm" variant="outline">
						Setup LLM provider
					</Button>
				</a>
			</motion.div>
		);
	}

	// Return the app screen based on the hash value
	const getAppScreen = (page: string) => {
		if (page === 'chat') return <Chat db={db} model={model} />;
		if (page === 'writer') return <Writer db={db} model={model} />;
		return <div className="text-muted-foreground w-full text-center">This page doesn't exist</div>;
	};

	return (
		<div className="relative flex items-center justify-center min-w-screen min-h-screen overflow-x-hidden bg-background">
			<div className="w-full h-full">
				<div className="z-50 fixed top-4 left-0 px-4 flex w-full justify-space-between">
					<Navbar value={hash as TabName} onTabChange={setHash} />
				</div>

				<Toaster theme={theme} position="bottom-right" closeButton={true} />

				{getAppScreen(hash)}
			</div>
		</div>
	);
}
