import type { Request, Response } from 'express';
import { createApp } from '../src/app.setup.js';

// Shared Nest application instance between serverless cold/warm invocations.
let app: Awaited<ReturnType<typeof createApp>> | undefined;

export default async function handler(req: Request, res: Response) {
  if (!app) {
    app = await createApp();
    await app.init();
  }

  const instance = app
    .getHttpAdapter()
    .getInstance() as unknown as (req: Request, res: Response) => void;
  instance(req, res);
}