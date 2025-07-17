import { getTokensCountColor } from '@/lib/utils';

const formatter = new Intl.NumberFormat('en', { notation: 'standard' });

interface InfoBarProps {
	modelName: string;
	messagesCount?: number;
	totalTokens?: number;
}

/**
 * Info component that displays the model name, number of messages, and total tokens used.
 */
export function InfoBar({ modelName, messagesCount, totalTokens }: InfoBarProps) {
	return (
		<div className="flex gap-2 text-xs text-muted-foreground px-1">
			<b>{modelName}</b>

			{typeof messagesCount === 'number' && (
				<>
					<span className="text-muted">/</span>
					<span>
						<b>{formatter.format(messagesCount)}</b> {messagesCount === 1 ? 'message' : 'messages'}
					</span>
				</>
			)}

			{typeof totalTokens === 'number' && (
				<>
					<span className="text-muted">/</span>
					<span className={getTokensCountColor(totalTokens)}>
						<b>{formatter.format(totalTokens)}</b> {totalTokens === 1 ? 'token' : 'tokens'}
					</span>
				</>
			)}
		</div>
	);
}
