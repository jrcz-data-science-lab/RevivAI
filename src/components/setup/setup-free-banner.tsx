import { Gift } from 'lucide-react';
import { Card } from '../ui/card';

export function SetupFreeBanner() {
	return (
		<Card className="relative p-6 text-sm shadow-none bg-violet-600/10 border-violet-400/50  text-violet-800/80 dark:text-violet-200 gap-2 animate-in zoom-in-95">
			<div className="flex items-center absolute -top-4 -left-4 rounded-full bg-violet-500 p-2">
				<Gift className="-rotate-12 text-white" />
			</div>
			<h2 className="font-black text-xl font-serif">We offer a free LLM to test out RevivAI!</h2>
			<p>
				You can switch to a different one anytime through the settings! Please note that any code you upload will be processed by our LLMs, so be cautious about
				sharing sensitive information.
			</p>
		</Card>
	);
}
