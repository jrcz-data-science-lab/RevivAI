import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';

// const db = new PGlite('idb://my-pgdata');

export function Projects() {

	return (
		<motion.div
			className='w-full max-w-xl'
            initial={{ opacity: 0, translateY: 32 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
        >
			<div className='relative w-full max-w-md mb-32'>
				<h1 className='text-2xl font-serif'>Select your project:</h1>

				<Button className='absolute top-0 right-0' variant='outline' size='sm'>Create New</Button>
			</div>
		</motion.div>
	);
}


	async function getDatabases() {
        console.log(123)
		const databases = await window.indexedDB.databases();

		databases.map((db) => db.name);
	}

	getDatabases().then(console.log);

    