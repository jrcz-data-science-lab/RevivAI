import type { Codebase } from '@/hooks/useDb';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { ScrollArea } from '../ui/scroll-area';
import { useMemo } from 'react';
import { cn, getTokensCountColor } from '@/lib/utils';

interface UploadCodebaseProps {
	codebase: Codebase;
	onNewCodebase: () => void;
}

export function UploadCodebase({ codebase, onNewCodebase }: UploadCodebaseProps) {
	const createdAtFormatted = formatDistanceToNow(codebase.createdAt, { addSuffix: true, includeSeconds: true });

	// Sort the files by token count
	const largestFiles = useMemo(
		() => Object.entries(codebase.metadata.fileTokenCounts).sort(([, a], [, b]) => b - a),
		[codebase],
	);

	return (
		<div className="animate-in fade-in">
			<div className="relative border rounded-xl p-4 mb-4 space-y-8">
				<div className="text-xs text-muted-foreground absolute top-4 right-4">{createdAtFormatted}</div>

				<div>
					<h2 className="text-md font-bold">Current Codebase</h2>
					<span className="text-sm text-muted-foreground">
						{codebase.type === 'files' ? 'Uploaded files' : codebase.repositoryUrl}
					</span>
				</div>

				<div className="grid grid-cols-3 gap-6">
					<div>
						<h3 className="text-xs text-muted-foreground">Tokens Count</h3>
						<div className={getTokensCountColor(codebase.metadata.totalTokens)}>
							{codebase.metadata.totalTokens.toLocaleString()}
						</div>
					</div>

					<div>
						<h3 className="text-xs text-muted-foreground">Files Count</h3>
						<div>{codebase.metadata.totalFiles}</div>
					</div>

					<div>
						<h3 className="text-xs text-muted-foreground">Compressed</h3>
						<div>{codebase.compress ? 'Yes' : 'No'}</div>
					</div>

					<div>
						<h3 className="text-xs text-muted-foreground">Include Patterns</h3>
						<div>{codebase.include || 'Not specified'}</div>
					</div>

					<div>
						<h3 className="text-xs text-muted-foreground">Ignore Patterns</h3>
						<div>{codebase.ignore || 'Not specified'}</div>
					</div>
				</div>

				<div>
					<h3 className="text-xs text-muted-foreground mb-2">Largest Files</h3>
					<ScrollArea className="relative h-48">
						{largestFiles.map(([file, tokensCount]) => (
							<div key={file} className="flex justify-between text-xs font-mono items-center border-b py-1.5">
								<span
									className="max-w-xs truncate text-left direction-rtl text-ellipsis"
									style={{ direction: 'rtl', textAlign: 'left' }}
									title={file}
								>
									{file}
								</span>
								<span
									className={cn(
										'text-muted-foreground flex-shrink-0 pl-2',
										getTokensCountColor(tokensCount, 15_000, 30_000),
									)}
								>
									{tokensCount.toLocaleString()} tokens
								</span>
							</div>
						))}
					</ScrollArea>
				</div>
			</div>
			<Button type="submit" className="w-full" size="sm" variant="outline" onClick={onNewCodebase}>
				Upload New Codebase
			</Button>
		</div>
	);
}
