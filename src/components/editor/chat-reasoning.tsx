import { Button } from '../ui/button';
import { memo, useEffect, useState } from 'react';
import { ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../ui/collapsible';
import ChatMarkdown from './chat-markdown';
import { cn } from '@/lib/utils';

interface ChatReasoningProps {
    open: boolean;
	content: string;
}

function ChatReasoning({ open, content }: ChatReasoningProps) {
	const [isUserOpened, setIsUserOpened] = useState<boolean | null>(null);
    const isOpen = isUserOpened === null ? open : isUserOpened;

	return (
		<Collapsible open={isOpen} onOpenChange={setIsUserOpened} className={cn("bg-muted rounded-xl p-4 py-3 w-full mb-3")}>
			<div className={cn('flex items-center justify-between -mr-2', isOpen && 'mb-3')}>
				<span className={cn('text-sm inline-block opacity-30', open && 'animate-pulse')}>Reasoning</span>
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="sm">
						<ChevronDown className={cn('h-4 w-4', isOpen && 'rotate-180')} />
						<span className="sr-only">Toggle</span>
					</Button>
				</CollapsibleTrigger>
			</div>

			<CollapsibleContent>
				<ChatMarkdown>{content.trim()}</ChatMarkdown>
			</CollapsibleContent>
		</Collapsible>
	);
}

export default memo(ChatReasoning);
