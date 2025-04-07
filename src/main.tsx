import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/global.css';
import App from './components/app.tsx';

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
