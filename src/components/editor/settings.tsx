import { memo } from 'react';
import { Button } from '../ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

function Settings() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" round size="icon">
					<SlidersHorizontal />
				</Button>
			</DialogTrigger>

				<DialogContent className='max-h-[90vh] overflow-y-scroll'>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete your account and remove your data from our servers.
						</DialogDescription>
					</DialogHeader>

					<div>
						<p>
							sdfsdfsdf Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione facere fugit pariatur doloribus quibusdam
							nulla blanditiis doloremque cupiditate aspernatur, porro sed numquam modi. Exercitationem praesentium facere laboriosam
							sunt beatae quibusdam.
						</p>
						<p>
							sdfsdfsdf Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione facere fugit pariatur doloribus quibusdam
							nulla blanditiis doloremque cupiditate aspernatur, porro sed numquam modi. Exercitationem praesentium facere laboriosam
							sunt beatae quibusdam.
						</p>
						<p>
							sdfsdfsdf Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione facere fugit pariatur doloribus quibusdam
							nulla blanditiis doloremque cupiditate aspernatur, porro sed numquam modi. Exercitationem praesentium facere laboriosam
							sunt beatae quibusdam.
						</p>
						<p>
							sdfsdfsdf Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione facere fugit pariatur doloribus quibusdam
							nulla blanditiis doloremque cupiditate aspernatur, porro sed numquam modi. Exercitationem praesentium facere laboriosam
							sunt beatae quibusdam.
						</p>
						<p>
							sdfsdfsdf Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione facere fugit pariatur doloribus quibusdam
							nulla blanditiis doloremque cupiditate aspernatur, porro sed numquam modi. Exercitationem praesentium facere laboriosam
							sunt beatae quibusdam.
						</p>

						<p>
							sdfsdfsdf Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione facere fugit pariatur doloribus quibusdam
							nulla blanditiis doloremque cupiditate aspernatur, porro sed numquam modi. Exercitationem praesentium facere laboriosam
							sunt beatae quibusdam.
						</p>
						<p>
							sdfsdfsdf Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione facere fugit pariatur doloribus quibusdam
							nulla blanditiis doloremque cupiditate aspernatur, porro sed numquam modi. Exercitationem praesentium facere laboriosam
							sunt beatae quibusdam.
						</p>
						<p>
							sdfsdfsdf Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione facere fugit pariatur doloribus quibusdam
							nulla blanditiis doloremque cupiditate aspernatur, porro sed numquam modi. Exercitationem praesentium facere laboriosam
							sunt beatae quibusdam.
						</p>
						<p>
							sdfsdfsdf Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione facere fugit pariatur doloribus quibusdam
							nulla blanditiis doloremque cupiditate aspernatur, porro sed numquam modi. Exercitationem praesentium facere laboriosam
							sunt beatae quibusdam.
						</p>
						<p>
							sdfsdfsdf Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione facere fugit pariatur doloribus quibusdam
							nulla blanditiis doloremque cupiditate aspernatur, porro sed numquam modi. Exercitationem praesentium facere laboriosam
							sunt beatae quibusdam.
						</p>
						<p>
							sdfsdfsdf Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione facere fugit pariatur doloribus quibusdam
							nulla blanditiis doloremque cupiditate aspernatur, porro sed numquam modi. Exercitationem praesentium facere laboriosam
							sunt beatae quibusdam.
						</p>
					</div>
				</DialogContent>
		</Dialog>
	);
}

export default memo(Settings);
