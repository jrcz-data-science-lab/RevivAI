import { Brain, Gamepad2, Notebook, ScrollText } from 'lucide-react';
import { WriterTemplatesItem } from './writer-templates-item';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useState } from 'react';
import { Button } from '../ui/button';

export type WriterTemplatesType = 'readme' | 'game' | 'api-reference' | 'generate';

interface WriterTemplatesProps {
	isLoading: boolean;
	onTemplateApply: (template: WriterTemplatesType) => void;
}

export function WriterTemplates({ isLoading, onTemplateApply }: WriterTemplatesProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState<WriterTemplatesType | null>(null);

	const onTemplateSelect = (template: WriterTemplatesType) => {
		setSelectedTemplate(template);
		setIsModalOpen(true);
	};

	const onApplyTemplate = async () => {
		if (selectedTemplate) onTemplateApply(selectedTemplate);
		setSelectedTemplate(null);
		setIsModalOpen(false);
	};

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-xl font-serif font-black mb-1.5">Templates</h1>
				<p className="text-md text-muted-foreground">
					Select a template you going to use for documentation. You can customize the content and structure later.
				</p>
			</div>

			<div className="grid grid-cols-2 gap-4 items-start w-full">
				<WriterTemplatesItem
					icon={Brain}
					color="gray"
					title="Generate Template"
					isDisabled={isLoading}
					onClick={() => onTemplateSelect('generate')}
					description="Use AI to generate documentation structure for your project. Result may vary!"
				/>

				<WriterTemplatesItem
					icon={ScrollText}
					color="lime"
					title="README.md"
					isDisabled={isLoading}
					onClick={() => onTemplateSelect('readme')}
					description="Markdown file for your repository. Perfect for open-source or small personal projects."
				/>
				<WriterTemplatesItem
					icon={Gamepad2}
					color="violet"
					title="Game Project"
					isDisabled={isLoading}
					onClick={() => onTemplateSelect('game')}
					description="Documentation for projects, made with game engines. Includes sections for gameplay, mechanics, and more. "
				/>
				<WriterTemplatesItem
					icon={Notebook}
					color="pink"
					title="API Reference"
					isDisabled={isLoading}
					onClick={() => onTemplateSelect('api-reference')}
					description="Detailed API reference for your project. Great for microservices, REST APIs or Web frameworks."
				/>
			</div>

			<Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
				<DialogContent className="max-w-3xl">
					<DialogHeader className="mb-4">
						<DialogTitle>
							Do you want to use <span>"{selectedTemplate}"</span> template?
						</DialogTitle>
						<DialogDescription>
							All previous content <i>(chapters, exports)</i> will be erased. Are you sure you want to continue?
						</DialogDescription>
					</DialogHeader>

					<Button onClick={onApplyTemplate}>Apply Template</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
}
