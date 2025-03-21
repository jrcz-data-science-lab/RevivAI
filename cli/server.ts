import open from "open";
import getPort from "get-port";
import { serveDir } from '@std/http';
import { join } from '@std/path';
import * as color from '@std/fmt/colors';

// Path to the UI directory
const WEB_UI_PATH = join(import.meta?.dirname + '', '../ui/dist');

/**
 * Request handler for the HTTP server.
 * @param req Request object.
 */
const handler = (req: Request) => {
	const { pathname } = new URL(req.url);

	// Handle API requests
	if (pathname.startsWith('/api')) {
		return new Response('API not implemented yet', { status: 200 });
	}

	// Serve directory
	return serveDir(req, { fsRoot: WEB_UI_PATH });
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
			console.log('');
			console.log(color.cyan('● ') + `HTTP server started on ${color.cyan(serverUrl)}`);
			console.log(color.gray('  To stop server, press Ctrl+C'));
			console.log('')
			open(serverUrl);
		},
		onError: (error) => {
			console.error(color.red('● ') + `Failed to start the server: ${error}`);
			Deno.exit(1);
		}
	}, handler);
}
