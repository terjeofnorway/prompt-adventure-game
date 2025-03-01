import { createServer } from 'vite';
import { spawn } from 'child_process';

async function startDev() {
  // Start Vite server locally
  const vite = await createServer({
    configFile: 'packages/client/vite.config.ts',
    root: 'packages/client',
    server: {
      port: 3000,
      strictPort: true,
    },
    logLevel: 'info',
    clearScreen: false,
  });

  await vite.listen();
  const port = vite.config.server.port;
  vite.openBrowser(`http://localhost:${port}`);

  console.log(`\n  ➜ Client running at: http://localhost:${port}/`);

  // Start server development
  const server = spawn('tsx', ['--watch', 'packages/server/src/index.ts'], {
    stdio: 'inherit',
  });

  // Handle cleanup
  const cleanup = () => {
    server.kill();
    vite.close();
    process.exit();
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

startDev();
