import { GraduationCap, Notebook, ScrollText } from 'lucide-react';
import { Card } from '../ui/card';
import { WriterTemplatesItem } from './writer-templates-item';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useState } from 'react';
import { Button } from '../ui/button';

export function WriterTemplates() {
	const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

	const handleTemplateSelect = (template: string) => {
		setSelectedTemplate(template);
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-xl font-serif font-black">Templates</h1>
				<p className="text-md text-muted-foreground">
					Select a template you going to use for documentation. You can customize the content and structure later.
				</p>
			</div>

			<div className="grid grid-cols-2 gap-4 w-full">
				<WriterTemplatesItem
					icon={ScrollText}
					color="emerald"
					title="README.md"
					onClick={() => handleTemplateSelect('readme')}
					description="Markdown file for your repository. Perfect for open-source or small personal projects."
				/>
				<WriterTemplatesItem
					icon={GraduationCap}
					color="amber"
					title="Documentation"
					onClick={() => handleTemplateSelect('documentation')}
					description="Comprehensive documentation for your project. Ideal for larger projects or libraries."
				/>
				<WriterTemplatesItem
					icon={Notebook}
					color="blue"
					title="API Reference"
					onClick={() => handleTemplateSelect('api-reference')}
					description="Detailed API reference for your project. Great for libraries or frameworks."
				/>
			</div>

			<Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
				<DialogContent className="max-w-3xl">
					<DialogHeader className="mb-4">
						<DialogTitle>Do you want to use <span>"{selectedTemplate}"</span> template?</DialogTitle>
						<DialogDescription>All previous content <i>(chapters, exports)</i> will be erased. Are you sure you want to continue?</DialogDescription>
					</DialogHeader>

					<Button>
						Apply Template
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
}
