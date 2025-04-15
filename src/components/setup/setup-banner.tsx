import { Gift } from 'lucide-react';
import { Card } from '../ui/card';

export function SetupBanner() {
		return (
			<Card className="relative p-6 mt-4 text-sm shadow-none space-y-2 bg-violet-600/10 border-violet-400/50  text-violet-800/80 dark:text-violet-200 gap-2 animate-in zoom-in-95">
				<div className="flex items-center absolute -top-4 -left-4 rounded-full bg-violet-500 p-2">
					<Gift className="-rotate-12 text-white" />
				</div>
				<h2 className="font-black text-xl font-serif">We offer a free LLM to test out RevivAI!</h2>
				<p>This is a great way to get started and see how RevivAI works. You can switch to a different LLM provider anytime through the settings!</p>
				<p>Please note that any code you upload will be processed by our LLMs, so don't upload any security-critical code or sensitive information.</p>
			</Card>
		);
	}
