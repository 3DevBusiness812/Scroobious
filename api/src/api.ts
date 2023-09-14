import 'reflect-metadata';
import { getContainer, Logger } from './core';
import { getServer } from './server';

async function bootstrap() {
  const server = getServer();
  return server.start();
}

bootstrap()
  .then(() => {
    // console.log('Server started successfully');
  })
  .catch((error: Error) => {
    // console.log('Exiting due to unspecfied error');
    // console.log(error);

    const logger = getContainer(Logger);
    logger.error('Failed to bootstrap API', error);
    if (error.stack) {
      logger.error('Stacktrace', error.stack);
    }
    process.exit(1);
  });

process.on('uncaughtException', (error: Error) => {
  console.error(error);
  console.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on('beforeExit', (code) => {
  // // Can make asynchronous calls
  // setTimeout(() => {
  // console.log(`Process will exit with code: ${code}`);
  process.exit(code);
  // }, 100);
});

process.on('exit', (code) => {
  // Only synchronous calls
  // console.log(`Process exited with code: ${code}`);
});

process.on('unhandledRejection', (reason, promise) => {
  // console.log('Unhandled rejection at ', promise, `reason: ${reason}`);
  process.exit(1);
});
