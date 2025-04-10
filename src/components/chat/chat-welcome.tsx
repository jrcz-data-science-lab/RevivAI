import { memo } from 'react';
import { AnimatedText } from '../ui/animated-text';

function ChatWelcome() {
	return (
		<div>
			<AnimatedText as="h1" className="text-xl font-black font-serif mb-4">
				Curious about your code? Ask about it!
			</AnimatedText>
			<AnimatedText className="text-sm opacity-70">
				It could be anything from "How do I create a new table?" to "What is the difference between a LEFT JOIN and a RIGHT JOIN?".
			</AnimatedText>
		</div>
	);
}

export default memo(ChatWelcome);
