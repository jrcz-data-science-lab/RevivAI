import type { ElementType } from 'react';
import { cn } from '@/lib/utils';
import { Trash } from 'lucide-react';

interface WriterSidebarItemProps {
	icon: ElementType;
	title: string;
	active?: boolean;
	onClick?: () => void;
	onDelete?: () => void;
}

export function WriterSidebarItem({ icon: Icon, title, active, onClick, onDelete }: WriterSidebarItemProps) {
	return (
		<div>
			<button
				type="button"
				onClick={() => onClick?.()}
				className={cn(
					'flex w-full min-h-8 gap-2 items-center transition-all duration-100',
					active ? 'text-foreground pl-1' : 'text-muted-foreground hover:pl-1 active:pl-0.5 cursor-pointer',
				)}
			>
				<Icon className="size-4" />
				<span className="text-sm">{title}</span>
			</button>

			{typeof onDelete === 'function' && (
				<div className="flex items-center h-8 absolute top-0 right-0 opacity-0 transition-all group-hover:opacity-100">
					<button type="button" onClick={() => onDelete()}>
						<Trash className="h-4 hover:text-destructive cursor-pointer" />
					</button>
				</div>
			)}
		</div>
	);
}
