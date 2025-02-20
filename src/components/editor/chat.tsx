import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PGlite } from '@electric-sql/pglite';

import { CircleStop, LoaderPinwheel, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';
import { marked } from 'marked'

import { useTokensCount } from '@/hooks/useTokensCount';
import { Navbar } from './navbar';
import { AnimatedText } from '../ui/animated-text';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

import { streamText } from 'ai';
import { createOllama } from 'ollama-ai-provider';

const ollama = createOllama({
	baseURL: 'http://145.19.54.111:11434/api/',
});


export function Chat() {
	const chatInputRef = useRef<HTMLTextAreaElement>(null);
	const chatContainerRef = useRef<HTMLDivElement>(null);

	const [isStreaming, setIsStreaming] = useState(false);
	const streamingAbortController = useRef<AbortController | null>(null);

	const [input, setInput] = useState('');
	const [messages, setMessages] = useState<string[]>([]);
	const [responses, setResponses] = useState<string[]>([]);

	const [content, setContent] = useState('');    
	const rendered = useMemo(() => {
		const answer = content.split('</think>').pop() || '';
		return marked(answer, { async: false });
	}, [content]);

	const tokensCount = useTokensCount(input, 300);
	

	useEffect(() => {
		const abortController = new AbortController();

		// Automatically focus the chat input when the page loads
		document.addEventListener(
			'keydown',
			(event) => {
				if (event.key !== 'Tab') chatInputRef.current?.focus();
			},
			{ signal: abortController.signal },
		);

		return () => abortController.abort();
	}, []);

	const handleKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
		if (event.key === 'Enter') {
			event.preventDefault();
			submitMessage(event.currentTarget.value);
		}
	};

	const stopStreaming = () => {
		if (streamingAbortController.current) streamingAbortController.current?.abort();
		setIsStreaming(false);
	};

	const submitMessage = async (value: string) => {
		if (streamingAbortController.current) stopStreaming();
		streamingAbortController.current = new AbortController();

		if (value === '') return;
		setMessages((prev) => [...prev, value]);
		setContent('');
		setInput('');

		// Smooth scroll to the bottom of container
		setTimeout(() => {
			chatContainerRef.current?.scrollTo({ 
				top: chatContainerRef.current?.scrollHeight,
				behavior: 'smooth' 
			});
		}, 0);

		const id = toast.loading('Processing your request...', { dismissible: true });
 
		const result = streamText({
			model: ollama('deepseek-r1:70b'),
			prompt: value,
			abortSignal: streamingAbortController.current.signal,
			onError: (error) => {
				toast.dismiss(id);
				setIsStreaming(false);
			},
			onFinish: () => {
				toast.dismiss(id);
				setIsStreaming(false);
			}
		});

		for await (const textPart of result.textStream) {
			setIsStreaming(true);
			setContent(prev => prev + textPart);
		}

		toast.dismiss(id);

	};

	return (
		<div ref={chatContainerRef} className={cn('flex flex-col w-full overflow-x-hidden max-h-screen', messages.length > 0 && 'min-h-screen')}>
			<div className="z-50 fixed top-6 left-0 px-4 md:top-12 md:px-16 flex w-full justify-space-between">
				<Navbar />
			</div>

			{/* Gradient overlays */}
			<div className="z-40 fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent"></div>
			<div className="z-40 fixed top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent"></div>
			<div className="z-40 fixed top-0 left-0 w-full h-16 bg-gradient-to-b from-background to-transparent"></div>

			<Toaster />

			{/* <div className='max-w-prose mx-auto mb-8'>
				<Dropzone />
			</div> */}
			<div className="z-0 flex flex-col w-full min-h-fit max-w-prose mx-auto overflow-x-hidden gap-2 px-8">
				{messages.length === 0 && (
					<div>
						<AnimatedText as="h1" className="text-2xl font-black font-serif mb-5">
							Ask some question about your code!
						</AnimatedText>
						<AnimatedText delay={0.3} className="text-sm opacity-70">
							It could be anything from "How do I create a new table?" to "What is the difference between a LEFT JOIN and a RIGHT
							JOIN?".
						</AnimatedText>
					</div>
				)}

				{messages.length > 0 && (
					<div className="flex flex-col gap-12 py-32">
						{messages.map((message, index) => {
							const isLast = index === messages.length - 1;
							const response = responses[index];

							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, translateY: 20 }}
									animate={{ opacity: isLast ? 1 : 0.5, scale: isLast ? 1 : 0.95, translateY: 0 }}
									transition={{ duration: 0.5, type: isLast ? 'spring' : 'tween' }}
									className={cn('flex flex-col gap-6 origin-top', isLast && 'mb-[50vh]')}
								>
									<div className="flex flex-col gap-2 relative message p-6">
										<h3 className="break-words text-2xl font-black font-serif">{message}</h3>

										<Separator className="mb-4" />

										{isStreaming && isLast && <LoaderPinwheel className="animate-spin absolute -left-6 top-7 opacity-50" />}

										{isLast && (
											<div className="prose dark:prose-invert text-sm" dangerouslySetInnerHTML={{ __html: rendered }}></div>
										)}

										{!isLast && response && (
											<div className="prose dark:prose-invert text-sm" dangerouslySetInnerHTML={{ __html: response }}></div>
										)}
									</div>
								</motion.div>
							);
						})}
					</div>
				)}

				<div
					className={cn(
						'flex flex-col gap-2 w-full h-auto mt-16 max-w-prose bg-background',
						messages.length > 0 && 'absolute bottom-0 pb-8',
					)}
				>
					<div className="relative w-full h-auto">
						<Button
							size="icon"
							variant={isStreaming ? 'outline' : 'link'}
							onClick={() => (isStreaming ? stopStreaming() : submitMessage(input))}
							className={cn('absolute bottom-1.5 right-1.5')}
						>
							{isStreaming ? <CircleStop /> : <Send className={cn(input === '' && 'opacity-50 pointer-events-none cursor-default')} />}
						</Button>
						<Textarea
							ref={chatInputRef}
							placeholder="Type your message here."
							value={input}
							onKeyDown={handleKeydown}
							onChange={(event) => setInput(event.target.value)}
						/>
					</div>
					<p className="text-xs text-muted-foreground">
						Currently, context size is <b>{tokensCount}</b> {tokensCount === 1 ? 'token' : 'tokens'}.
					</p>
				</div>
			</div>
		</div>
	);
}
