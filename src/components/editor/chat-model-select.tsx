import { memo, use, useState } from 'react';
import { Badge } from '../ui/badge';
import { models, selectedChatModelAtom, type ChatModelKey } from '@/hooks/useChat';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useAtom } from 'jotai';


function ChatModelSelect() {
	const [selectedModel, setSelectedModel] = useAtom(selectedChatModelAtom);

    return (
        <div className="flex gap-2">
            {Object.entries(models).map(([modelKey, model]) => {
                return (
					<TooltipProvider key={modelKey}>
						<Tooltip delayDuration={600}>
							<TooltipTrigger>
								<Badge
									onClick={() => setSelectedModel(modelKey as ChatModelKey)}
									variant={selectedModel === modelKey ? 'default' : 'secondary'}
									className="cursor-pointer capitalize active:translate-y-0.5 duration-75 transition-transform"
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