import { ArrowLeft, Settings, SunMoon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { ThemeToggle } from '../ui/theme-toggle';

export function Navbar() {
    return (
		<div className="flex w-full justify-center">
			<div className="w-full">
				<Button className="text-neutral-400" variant="ghost" round asChild>
					<a href="/">
						<ArrowLeft />
						Go back
					</a>
				</Button>
			</div>

			<Tabs defaultValue="account">
				<TabsList className="rounded-full">
					<TabsTrigger value="account" className="w-20 rounded-full">
						Chat
					</TabsTrigger>
					<TabsTrigger value="password" className="w-20 rounded-full">
						Writer
					</TabsTrigger>
				</TabsList>
			</Tabs>

			<div className="w-full flex gap-2 justify-end">
				<ThemeToggle />

				<Dialog>
					<DialogTrigger asChild>
						<Button variant="ghost" round size="icon">
							<Settings />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you absolutely sure?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your account and remove your data from our servers.
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}