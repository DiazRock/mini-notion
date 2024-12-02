import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create and export the server instance with handlers
export const server = setupServer(...handlers);
