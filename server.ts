import open from "open";
import getPort from "get-port";
import { serveDir } from '@std/http';
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

	// Serve directory
	return serveDir(req, { fsRoot: webPath });
};

/**
 * Start HTTP server on a preferred port.
 * @param port Port to start the server on.
 */
export async function startServer(port: number | undefined) {

	// Find appropriate port if not provided
	if (typeof port !== 'number') {
		port = await getPort({ port: 3000 });
	}
	
	const serverUrl = `http://localhost:${port}`;

	Deno.serve({
		port: port,
		onListen: () => {
			log.success(`HTTP server started on ${serverUrl}`);
			open(serverUrl);
		},
		onError: (error) => {
			log.error(`Failed to start server: ${error}`);
			Deno.exit(1);
		}
	}, handler);
}
