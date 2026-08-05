import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env, isProduction } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

export const app = express();

app.set('trust proxy', 1);

app.use(helmet());

const allowedOrigins = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : [];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan(isProduction ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cinematica-api', timestamp: new Date().toISOString() });
});

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);