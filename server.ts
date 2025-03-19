import { join } from '@std/path';
import { exists } from '@std/fs';
import open from "open";
import getPort from "get-port";
import { serveFile } from '@std/http';
import { log } from '@clack/prompts';

// Path to the UI directory
const webPath = import.meta.dirname + '/ui/dist';

const handler = async (req: Request) => {
	const { pathname } = new URL(req.url);
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

	// Handle API requests
	if (pathname.startsWith('/api')) {
		return new Response('API not implemented yet', { status: 200 });
	}

	// Serve file if found in
	const filePath = join(webPath, pathname);
	const fileExists = await exists(filePath, { isFile: true, isReadable: true });
	if (fileExists) return serveFile(req, filePath);

	// Serve index.html for all other requests
	return serveFile(req, join(webPath, 'index.html'));
};

export async function startServer(preferedPort = 3000) {
	const port = await getPort({ port: [preferedPort, 3001, 3002, 3003, 3004, 3005, 8080, 8081] });
	
	Deno.serve({
		port: port,
		onListen: () => {
			log.success(`HTTP server started on http://localhost:${port}`);
			open(`http://localhost:${port}`);
		},
	}, handler);
}
