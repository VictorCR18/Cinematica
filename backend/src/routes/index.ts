import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes.js';
import { usersRouter } from '../modules/users/users.routes.js';
import { moviesRouter } from '../modules/movies/movies.routes.js';
import { ratingsRouter } from '../modules/ratings/ratings.routes.js';
import { movieReviewsRouter, reviewsRouter } from '../modules/reviews/reviews.routes.js';
import { diaryRouter } from '../modules/diary/diary.routes.js';
import { watchlistRouter } from '../modules/watchlist/watchlist.routes.js';
import { listsRouter } from '../modules/lists/lists.routes.js';
import { feedRouter } from '../modules/feed/feed.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/movies', moviesRouter);
apiRouter.use('/movies', ratingsRouter);
apiRouter.use('/movies', movieReviewsRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/diary', diaryRouter);
apiRouter.use('/watchlist', watchlistRouter);
apiRouter.use('/lists', listsRouter);
apiRouter.use('/feed', feedRouter);
