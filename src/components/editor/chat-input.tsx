import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CircleStop, CircleX, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTokensCount } from '@/hooks/useTokensCount';
import ChatModelSelect from './chat-model-select';
import { contextSizeAtom } from '@/hooks/useChat';
import { useAtomValue } from 'jotai';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

const formatter = new Intl.NumberFormat('en', { notation: 'standard' });

interface ChatInputProps {
    onSubmit: (value: string) => void;
    onAbort: () => void;
    isStreaming: boolean;
}

export function ChatInput({ onSubmit, onAbort, isStreaming }: ChatInputProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [input, setInput] = useState('');

    // Display context size
    const contextSize = useAtomValue(contextSizeAtom);
    const tokensCount = useTokensCount(input, 150);
    const totalTokens = useMemo(() => tokensCount + contextSize, [tokensCount, contextSize]);

    useEffect(() => {
        const abortCtrl = new AbortController();

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Tab' && !event.metaKey) inputRef.current?.focus();
        });

        return () => abortCtrl.abort();
    }, []);

    const submitMessage = useCallback((value: string) => {
        value = value.trim();
        if (!value) return;
        
        setInput('');
        setTimeout(() => onSubmit(value));
    }, [onSubmit]);

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
					className={cn('absolute bottom-1.5 right-1.5')}
				>
					{isStreaming ? <CircleStop /> : <Send className={cn(input === '' && 'opacity-50 pointer-events-none cursor-default')} />}
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
				<p className="text-xs text-muted-foreground px-1">
					Currently, context size is <b>{formatter.format(totalTokens)}</b> {totalTokens === 1 ? 'token' : 'tokens'}.
				</p>

				<ChatModelSelect />
			</div>
		</div>
	);
}

export default memo(ChatInput);
