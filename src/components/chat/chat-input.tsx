import { memo, useCallback, useRef, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { CircleStop, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTokensCount } from '../../hooks/useTokensCount';
import { contextSizeAtom } from '../../hooks/useChat';
import { useAtomValue } from 'jotai';
import { Badge } from '../ui/badge';
import { InfoBar } from '../info-bar';

interface ChatInputProps {
	onSubmit: (value: string) => void;
	onAbort: () => void;
	onClear: () => void;
	modelName: string;
	messagesCount: number;
	isStreaming: boolean;
}

/**
 * ChatInput component that handles the input and submission of messages.
 * It also displays the model name, number of messages, and total tokens used.
 */
export function ChatInput({ onSubmit, modelName, messagesCount, onAbort, isStreaming, onClear }: ChatInputProps) {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [input, setInput] = useState('');

	// Display context size
	const contextSize = useAtomValue(contextSizeAtom);
	const tokensCount = useTokensCount(input, 150);
	const totalTokens = tokensCount + contextSize;

	const submitMessage = useCallback(
		(value: string) => {
			const trimmed = value.trim();
			if (!trimmed) return;

			setInput('');
			onSubmit(trimmed);
		},
		[onSubmit],
	);

	// Submit on enter key press
	const handleKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;

		if (event.key === 'Enter') {
			event.preventDefault();
			submitMessage(input);
		}
	};

	return (
		<div className="flex flex-col gap-3 w-full h-auto">
			<div id="chat-input" className="relative w-full h-auto">
				<Button
					size="icon"
					variant={isStreaming ? 'outline' : 'link'}
					onClick={() => (isStreaming ? onAbort() : submitMessage(input))}
					className={cn(
						'absolute bottom-1.5 right-1.5',
						input === '' && !isStreaming && 'opacity-50 pointer-events-none cursor-default',
					)}
				>
					{isStreaming ? <CircleStop /> : <Send />}
				</Button>
				<Textarea
					ref={inputRef}
					placeholder="Type your message here."
					value={input}
					onKeyDown={handleKeydown}
					onChange={(event) => setInput(event.target.value)}
				/>
			</div>

			<div className="flex justify-between align-center">
				<InfoBar modelName={modelName} messagesCount={messagesCount} totalTokens={totalTokens} />

				{messagesCount > 0 && (
					<Badge
						onClick={onClear}
						variant="secondary"
						className="cursor-pointer capitalize active:translate-y-0.5 duration-75 transition-transform"
					>
						Clear Chat
					</Badge>
				)}
			</div>
		</div>
	);
}

export default memo(ChatInput);
