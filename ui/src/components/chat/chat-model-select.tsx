import { memo } from 'react';
import { useAtom } from 'jotai';
import { Badge } from '../ui/badge';
import { selectedChatModelAtom } from '../../hooks/useChat';
import { type LanguageModelKey, languageModels } from '../../lib/models';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

function ChatModelSelect() {
	const [selectedModel, setSelectedModel] = useAtom(selectedChatModelAtom);

	return (
		<div className='flex gap-2'>
			{Object.entries(languageModels).map(([modelKey, model]) => {
				return (
					<TooltipProvider key={modelKey}>
						<Tooltip delayDuration={600}>
							<TooltipTrigger>
								<Badge
									onClick={() => setSelectedModel(modelKey as LanguageModelKey)}
									variant={selectedModel === modelKey ? 'default' : 'secondary'}
									className='cursor-pointer capitalize active:translate-y-0.5 duration-75 transition-transform'
								>
									{modelKey}
								</Badge>
							</TooltipTrigger>
							<TooltipContent>
								<p>{model.name}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				);
			})}
		</div>
	);
}

export default memo(ChatModelSelect);
