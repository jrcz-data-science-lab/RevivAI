import { useCodebase } from '@/hooks/useCodebase';
import { useDb } from '@/hooks/useDb';
import { useHashRouter } from '@/hooks/useHashRouter';
import { useModel } from '@/hooks/useModel';
import { currentProjectIdAtom, useProjects } from '@/hooks/useProjects';
import { useTheme } from '@/hooks/useTheme';
import { useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { Chat } from './chat/chat';
import Navbar, { type TabName } from './navbar';
import Settings from './settings';
import { Button } from './ui/button';
import { Toaster } from './ui/toaster';
import { Upload, isUploadOpenAtom } from './upload/upload';
import { Writer } from './writer/writer';

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
	const { codebase } = useCodebase({ db });

	const { isProjectExists } = useProjects();
	const { hash, setHash } = useHashRouter('chat');
	const setIsUploadOpen = useSetAtom(isUploadOpenAtom);

	// Hide the loading spinner after the app is mounted
	useEffect(() => {
		document.querySelector('#loading-spinner')?.remove();
	}, []);

	// Open upload dialog if no codebase exists
	useEffect(() => {
		const checkIfCodebaseExists = async () => {
			const codebasesCount = await db.codebases.count();
			if (codebasesCount === 0) setIsUploadOpen(true);
		};

		checkIfCodebaseExists();
	}, [setIsUploadOpen]);

	// If no project ID is provided or the project does not exist, show a message
	if (!projectId || !isProjectExists(projectId)) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.1, delay: 0.3 }}
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
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.1, delay: 0.3 }}
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
		if (codebase) {
			if (page === 'chat') return <Chat model={model} codebase={codebase} />;
			if (page === 'writer') return <Writer db={db} model={model} codebase={codebase} />;
			return <div className="text-muted-foreground w-full text-center">This page doesn't exist</div>;
		}
	};

	return (
		<div className="relative flex items-center justify-center min-w-screen min-h-screen overflow-x-hidden bg-background">
			<div className="w-full h-full">
				<div className="z-50 fixed top-4 left-0 px-4 flex w-full justify-space-between">
					<Navbar value={hash as TabName} onTabChange={setHash} />
				</div>

				<Toaster theme={theme} position="bottom-right" closeButton={true} />
				<Upload db={db} />
				<Settings />

				{getAppScreen(hash)}
			</div>
		</div>
	);
}
