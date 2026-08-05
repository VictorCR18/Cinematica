import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './movies.controller.js';
import { paginationQuerySchema, searchQuerySchema, tmdbIdParamSchema } from './movies.schema.js';

export const moviesRouter = Router();

moviesRouter.get('/popular', validate({ query: paginationQuerySchema }), controller.listPopular);
moviesRouter.get('/now-playing', validate({ query: paginationQuerySchema }), controller.listNowPlaying);
moviesRouter.get('/top-rated', validate({ query: paginationQuerySchema }), controller.listTopRated);
moviesRouter.get('/upcoming', validate({ query: paginationQuerySchema }), controller.listUpcoming);
moviesRouter.get('/genres', controller.listGenres);
moviesRouter.get('/search', validate({ query: searchQuerySchema }), controller.search);
moviesRouter.get('/:tmdbId', validate({ params: tmdbIdParamSchema }), controller.getDetails);
