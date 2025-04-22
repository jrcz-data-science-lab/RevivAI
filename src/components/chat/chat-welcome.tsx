import { memo } from 'react';
import { AnimatedText } from '../ui/animated-text';

function ChatWelcome() {
	return (
		<div>
			<AnimatedText as="h1" className="text-xl font-black font-serif mb-4">
				Curious how your code works? Ask about it!
			</AnimatedText>
			<AnimatedText className="text-sm text-muted-foreground">
				You can ask something like "What does this code do?" or ask to visualize your code with diagrams, flowcharts, and more!
			</AnimatedText>
		</div>
	);
}

export default memo(ChatWelcome);
