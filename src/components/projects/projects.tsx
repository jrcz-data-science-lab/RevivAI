import { useEffect, useMemo, useState } from 'react';
import { delay, motion } from 'motion/react';
import { FileUploadForm } from '../file-upload/file-upload-form';

export function Projects() {

	return (
		<div className="relative w-full h-full max-w-xl px-6 mx-auto">
			<motion.div
				initial={{ opacity: 0, translateY: 8 }}
				animate={{ opacity: 1, translateY: 0 }}
				transition={{ duration: 0.6, type: 'spring', delay: 0.3 }}
			>
				<FileUploadForm />
			</motion.div>
		</div>
	);
}


	// async function getDatabases() {
    //     console.log(123)
	// 	const databases = await window.indexedDB.databases();

	// 	databases.map((db) => db.name);
	// }

	// getDatabases().then(console.log);

