import type { ElementType } from 'react';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';

interface WriterTemplatesItemProps {
	color: keyof typeof variants;
	title: string;
	description: string;
	icon: ElementType;
	isDisabled: boolean;
	onClick?: () => void;
}

const variants = {
	amber: 'dark:text-amber-100 text-amber-800 border-amber-500/80 hover:border-amber-500 bg-amber-500/5',
	pink: 'dark:text-pink-100 text-pink-800 border-pink-500/80 hover:border-pink-500 bg-pink-500/5',
	indigo: 'dark:text-indigo-100 text-indigo-800 border-indigo-500/80 hover:border-indigo-500 bg-indigo-500/5',
	slate: 'dark:text-slate-100 text-slate-800 border-slate-500/80 hover:border-slate-500 bg-slate-500/5',
	violet: 'dark:text-violet-100 text-violet-800 border-violet-500/80 hover:border-violet-500 bg-violet-500/5',
	emerald: 'dark:text-emerald-100 text-emerald-800 border-emerald-500/80 hover:border-emerald-500 bg-emerald-500/5',
	red: 'dark:text-red-100 text-red-800 border-red-500/80 hover:border-red-500 bg-red-500/5',
	orange: 'dark:text-orange-100 text-orange-800 border-orange-500/80 hover:border-orange-500 bg-orange-500/5',
	purple: 'dark:text-purple-100 text-purple-800 border-purple-500/80 hover:border-purple-500 bg-purple-500/5',
	teal: 'dark:text-teal-100 text-teal-800 border-teal-500/80 hover:border-teal-500 bg-teal-500/5',
	blue: 'dark:text-blue-100 text-blue-800 border-blue-500/80 hover:border-blue-500 bg-blue-500/5',
	gray: 'dark:text-gray-100 text-gray-800 border-gray-500/80 hover:border-gray-500 bg-gray-500/5',
	lime: 'dark:text-lime-100 text-lime-800 border-lime-500/80 hover:border-lime-500 bg-lime-500/5',
};

export function WriterTemplatesItem({ icon: Icon, color, title, description, isDisabled, onClick }: WriterTemplatesItemProps) {
	const onSelect = () => {
		if (isDisabled) return;
		onClick?.();
	}

	return (
		<button
			type="button"
			onClick={onSelect}
			disabled={isDisabled}
			className={cn(
				'group cursor-pointer transition-all hover:-translate-y-1 active:translate-y-0 overflow-hidden w-full',
				isDisabled && 'opacity-75 pointer-events-none'
			)}
		>
			<Card className={cn('relative w-full px-6 flex justify-between', variants[color])}>
				<div className="ml-auto group-hover:scale-125 transition-all duration-200">
					<Icon />
				</div>

				<div className="text-left">
					<h2 className="text-xl font-serif font-black mb-2">{title}</h2>
					<p className="opacity-80">{description}</p>
				</div>
			</Card>
		</button>
	);
}
