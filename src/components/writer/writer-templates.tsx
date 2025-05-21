import { Brain, Gamepad2, Notebook, ScrollText } from 'lucide-react';
import { WriterTemplatesItem } from './writer-templates-item';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useState } from 'react';
import { Button } from '../ui/button';
import { templates, type TemplateKey } from '@/lib/templates/main';

interface WriterTemplatesProps {
	isLoading: boolean;
	onTemplateApply: (template: TemplateKey) => void;
}

export function WriterTemplates({ isLoading, onTemplateApply }: WriterTemplatesProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey | null>(null);

	const selectedTemplateName = selectedTemplate ? templates[selectedTemplate]?.name : 'unknown';

	const onTemplateSelect = (template: TemplateKey) => {
		setSelectedTemplate(template);
		setIsModalOpen(true);
	};

	const onApplyTemplate = async () => {
		if (selectedTemplate) onTemplateApply(selectedTemplate);
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
				{Object.entries(templates).map(([key, template]) => {
					return (
						<WriterTemplatesItem
							key={key}
							template={template}
							isDisabled={isLoading}
							onClick={() => onTemplateSelect(key as TemplateKey)}
						/>
					);
				})}
			</div>

			<Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
				<DialogContent className="max-w-lg">
					<DialogHeader className="mb-4">
						<DialogTitle>Use {selectedTemplateName} template?</DialogTitle>
						<DialogDescription>
							All current chapters content will be erased. Are you sure you want to continue?
						</DialogDescription>
					</DialogHeader>

					<Button onClick={onApplyTemplate}>Apply Template</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
}
