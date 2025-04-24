import { Brain, GraduationCap, Notebook, ScrollText } from 'lucide-react';
import { Card } from '../ui/card';
import { WriterTemplatesItem } from './writer-templates-item';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useState } from 'react';
import { Button } from '../ui/button';
import type { Database } from '@/hooks/useDb';
import { generateObject } from 'ai';

export type WriterTemplatesType = 'readme' | 'documentation' | 'api-reference' | 'generate';

interface WriterTemplatesProps {
	onTemplateApply: (template: WriterTemplatesType) => void;
}

export function WriterTemplates({ onTemplateApply }: WriterTemplatesProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState<WriterTemplatesType | null>(null);

	const onTemplateSelect = (template: WriterTemplatesType) => {
		setSelectedTemplate(template);
		setIsModalOpen(true);
	}

	const onApplyTemplate = async () => {
		if (selectedTemplate) onTemplateApply(selectedTemplate);
		setSelectedTemplate(null);
		setIsModalOpen(false);
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-xl font-serif font-black">Templates</h1>
				<p className="text-md text-muted-foreground">
					Select a template you going to use for documentation. You can customize the content and structure later.
				</p>
			</div>

			<div className="grid grid-cols-2 gap-4 items-start w-full">
				<WriterTemplatesItem
					icon={ScrollText}
					color="emerald"
					title="README.md"
					onClick={() => onTemplateSelect('readme')}
					description="Markdown file for your repository. Perfect for open-source or small personal projects."
				/>
				<WriterTemplatesItem
					icon={GraduationCap}
					color="amber"
					title="Documentation"
					onClick={() => onTemplateSelect('documentation')}
					description="Comprehensive documentation for your project. Ideal for larger projects or libraries."
				/>
				<WriterTemplatesItem
					icon={Notebook}
					color="blue"
					title="API Reference"
					onClick={() => onTemplateSelect('api-reference')}
					description="Detailed API reference for your project. Great for microservices, REST APIs or frameworks."
				/>
				<WriterTemplatesItem
					icon={Brain}
					color="gray"
					title="Generate"
					onClick={() => onTemplateSelect('generate')}
					description="Generate documentation structure for your project using AI. Result may vary."
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
