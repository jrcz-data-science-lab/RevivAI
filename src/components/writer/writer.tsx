import type { Codebase } from '@/hooks/useCodebase';
import type { Database } from '@/hooks/useDb';
import { type WriterItemId, useWriter } from '@/hooks/useWriter';
import type { LanguageModelV1 } from 'ai';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Suspense, lazy } from 'react';
import { Button } from '../ui/button';
import { WriterGenerate } from './writer-generate';
import { WriterSidebar } from './writer-sidebar';
import { WriterTemplates } from './writer-templates';

const WriterEditorLazy = lazy(() => import('./writer-editor'));

interface WriterProps {
	db: Database;
	model: LanguageModelV1;
	codebase: Codebase;
}

/**
 * Writer component that manages the writing interface.
 */

/**
 * Component for writing documentation.
 * Provides text editing, AI-powered content generation, template application,
 * and chapter organization in a sidebar-based layout.
 * @returns The Writer component that renders the complete writing workspace.
 */
export function Writer({ db, model, codebase }: WriterProps) {
	const {
		isGenerating,
		chapters,
		generate,
		cancelGeneration,
		activeItemId,
		setActiveItemId,
		removeChapter,
		reorderChapters,
		addChapter,
		applyTemplate,
		updateChapter,
	} = useWriter({ db, model, codebase });

	/**
	 * Renders the active item based on the activeItemId.
	 * @param id - The ID of the active item (or chapter).
	 * @returns The rendered component for the active item.
	 */
	const renderActiveItem = (id: WriterItemId) => {
		if (id === 'generate') {
			return (
				<WriterGenerate
					db={db}
					model={model}
					codebase={codebase}
					isLoading={isGenerating}
					onGenerate={generate}
					onGenerationCancel={cancelGeneration}
				/>
			);
		}

		if (id === 'templates') {
			return <WriterTemplates isLoading={isGenerating} onTemplateApply={applyTemplate} />;
		}

		// If chapters loaded and
		if (Array.isArray(chapters)) {
			const chapter = chapters?.find((chapter) => chapter.id === activeItemId);
			if (!chapter) {
				const chapterToSelect = chapters?.at(0)?.id ?? 'templates';
				setActiveItemId(chapterToSelect);
				return;
			}

			return (
				<WriterEditorLazy
					key={chapter.id}
					chapter={chapter}
					onChange={(updated) => updateChapter(chapter.id, updated)}
				/>
			);
		}
	};

	return (
		<div className="flex flex-col overflow-hidden h-screen w-screen">
			<div className="flex">
				<div className="relative z-40 bg-muted border-r flex flex-col w-full h-screen max-w-64">
					<WriterSidebar
						isGenerating={isGenerating}
						chapters={chapters}
						activeItemId={activeItemId}
						onSelect={setActiveItemId}
						onReorder={reorderChapters}
						onRemoveChapter={removeChapter}
					/>

					<div className="p-3 bg-muted absolute bottom-0 left-0 w-full flex flex-col gap-2 items-center justify-center">
						<Button variant="outline" className="w-full" size="lg" onClick={addChapter} disabled={isGenerating}>
							<Plus className="h-4 w-4 mr-2" />
							New Chapter
						</Button>
					</div>
				</div>

				<main className="relative z-20 h-screen pt-16 px-8 w-full overflow-x-hidden overflow-y-scroll">
					<div className="fixed top-0 left-0 w-full">
						<div className="absolute w-full h-16 bg-gradient-to-b from-background to-transparent" />
						<div className="absolute w-full h-12 bg-gradient-to-b from-background to-transparent" />
						<div className="absolute w-full h-8 bg-gradient-to-b from-background to-transparent" />
					</div>

					<Suspense>
						<motion.div
							initial={{ opacity: 0, x: -16 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.15 }}
							className="flex flex-col w-full justify-center space-y-6 min-xl:pr-38"
						>
							<div className="my-16">{renderActiveItem(activeItemId)}</div>
						</motion.div>
					</Suspense>
				</main>
			</div>
		</div>
	);
}
