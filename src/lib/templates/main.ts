import type { ElementType } from 'react';
import type { LanguageModelV1 } from 'ai';
import type { Settings } from '@/hooks/useSettings';
import type { Database } from '@/hooks/useDb';
import type { WriterTemplateColor } from '@/components/writer/writer-templates-item';
import { Brain, Gamepad2, Notebook, ScrollText } from 'lucide-react';

import { applyReadmeTemplate } from './readmeTemplate';
import { applySmartTemplate } from './smartTemplate';
import { applyApiReferenceTemplate } from './apiReferenceTemplate';

export interface Template {
	name: string;
	description: string;
	color: WriterTemplateColor;
	icon: ElementType;
	cancelable: boolean;
	apply: (db: Database, model: LanguageModelV1, settings: Settings, abortSignal: AbortSignal) => Promise<void>;
}

// All possible templates
export type TemplateKey = keyof typeof templates;

export const templates = {
	smart: {
		name: 'AI Assisted',
		description: 'Use AI to generate documentation structure for your project. Result may vary!',
		color: 'gray',
		icon: Brain,
		cancelable: true,
		apply: applySmartTemplate,
	},
	readme: {
		name: 'README.md',
		description: 'Markdown file for your repository. Perfect for open-source or small personal projects.',
		color: 'blue',
		icon: ScrollText,
		cancelable: false,
		apply: applyReadmeTemplate,
	},
	api: {
		name: 'API Reference',
		description: 'Detailed API reference for your project. Great for microservices, REST APIs or Web frameworks.',
		color: 'emerald',
		icon: Notebook,
		cancelable: true,
		apply: applyApiReferenceTemplate,
	},
	game: {
		name: 'Game Project',
		description:
			'Documentation for projects, made with game engines. Includes sections for gameplay, mechanics, and more. ',
		color: 'pink',
		icon: Gamepad2,
		cancelable: true,
		apply: applyReadmeTemplate,
	},
} as const satisfies Record<string, Template>;
