import { Logger } from '@nestjs/common';
import { createApp } from './app.setup.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await createApp();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Backend server successfully listening on port ${port} with prefix /api`);
}

bootstrap();