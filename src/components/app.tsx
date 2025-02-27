import { useTheme } from '@/hooks/useTheme';
import Navbar from './navbar';
import { Toaster } from 'sonner';
import { Chat } from './chat/chat';

export default function App() {
    const { theme } = useTheme();

    return (
		<div className="w-full h-full bg-background overflow-x-hidden">
			<div className="z-50 fixed top-4 left-0 px-4 md:top-8 md:px-12 flex w-full justify-space-between">
				<Navbar />
			</div>

			<div className="z-40 fixed top-0 left-0 w-full">
				<div className="absolute w-full h-32 bg-gradient-to-b from-background to-transparent"></div>
				<div className="absolute w-full h-32 bg-gradient-to-b from-background to-transparent"></div>
				<div className="absolute w-full h-32 bg-gradient-to-b from-background to-transparent"></div>
			</div>

			<Toaster theme={theme} position="bottom-left" />

			<Chat />
		</div>
	);
}
