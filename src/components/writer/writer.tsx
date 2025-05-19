import type { Database } from '@/hooks/useDb';
import type { LanguageModelV1 } from 'ai';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { WriterSidebar } from './writer-sidebar';
import { WriterEditor } from './writer-editor';
import { WriterGenerate } from './writer-generate';
import { WriterTemplates } from './writer-templates';
import { useWriter, type WriterItemId } from '@/hooks/useWriter';
import { useEffect } from 'react';

interface WriterProps {
	db: Database;
	model: LanguageModelV1;
}

/**
 * Writer component that manages the writing interface.
 */
export function Writer({ db, model }: WriterProps) {
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
	} = useWriter({ db, model });

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
					isLoading={isGenerating}
					onGenerate={generate}
					onGenerationCancel={cancelGeneration}
				/>
			);
		}

		if (id === 'templates') {
			return <WriterTemplates isLoading={isGenerating} onTemplateApply={applyTemplate} />;
		}

		// If chapters loaded
		if (Array.isArray(chapters)) {
			const chapter = chapters?.find((chapter) => chapter.id === activeItemId);
			if (!chapter) {
				const chapterToSelect = chapters?.at(0)?.id ?? 'templates';
				setActiveItemId(chapterToSelect);
				return;
			}

			return <WriterEditor chapter={chapter} onChange={(updated) => updateChapter(chapter.id, updated)} />;
		}
	};

	return (
		<div className="flex flex-col overflow-hidden h-screen w-screen">
			<div className="flex">
				<div className="relative z-40 bg-muted border-r flex flex-col w-full h-screen max-w-64">
					<WriterSidebar
						chapters={chapters}
						activeItemId={activeItemId}
						onSelect={setActiveItemId}
						onReorder={reorderChapters}
						onRemoveChapter={removeChapter}
					/>

					<div className="p-3 bg-muted absolute bottom-0 left-0 w-full flex items-center justify-center">
						<Button variant="outline" className="w-full" size="lg" onClick={addChapter}>
							<Plus className="h-4 w-4 mr-2" />
							New Chapter
						</Button>
					</div>
				</div>

				<motion.div
					key={activeItemId}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.15, ease: 'easeIn' }}
					className="relative z-20 h-screen pt-16 px-8 w-full overflow-x-hidden overflow-y-scroll"
				>
					<div className="fixed top-0 left-0 w-full">
						<div className="absolute w-full h-16 bg-gradient-to-b from-background to-transparent" />
						<div className="absolute w-full h-12 bg-gradient-to-b from-background to-transparent" />
						<div className="absolute w-full h-8 bg-gradient-to-b from-background to-transparent" />
					</div>

					<div className="flex flex-col w-full justify-center space-y-6 min-xl:pr-38">
						<div className="my-16">{renderActiveItem(activeItemId)}</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
