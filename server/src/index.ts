import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas for input validation
import { 
  createItemInputSchema, 
  getItemsInputSchema, 
  getItemInputSchema, 
  updateItemInputSchema, 
  deleteItemInputSchema 
} from './schema';

// Import handlers
import { createItem } from './handlers/create_item';
import { getItems } from './handlers/get_items';
import { getItem } from './handlers/get_item';
import { updateItem } from './handlers/update_item';
import { deleteItem } from './handlers/delete_item';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Create a new item (article)
  createItem: publicProcedure
    .input(createItemInputSchema)
    .mutation(({ input }) => createItem(input)),

  // Get items with pagination and filtering
  getItems: publicProcedure
    .input(getItemsInputSchema)
    .query(({ input }) => getItems(input)),

  // Get a single item by ID
  getItem: publicProcedure
    .input(getItemInputSchema)
    .query(({ input }) => getItem(input)),

  // Update an existing item
  updateItem: publicProcedure
    .input(updateItemInputSchema)
    .mutation(({ input }) => updateItem(input)),

  // Delete an item
  deleteItem: publicProcedure
    .input(deleteItemInputSchema)
    .mutation(({ input }) => deleteItem(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      // Enable CORS for all routes
      cors({
        origin: process.env['CLIENT_URL'] || 'http://localhost:3000',
        credentials: true,
      })(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  
  server.listen(port);
  console.log(`🚀 TRPC server listening at port: ${port}`);
  console.log(`📱 Mobile-first homepage API ready for Chinese mainland users`);
  console.log(`🌐 Health check: http://localhost:${port}/healthcheck`);
}

start().catch(console.error);