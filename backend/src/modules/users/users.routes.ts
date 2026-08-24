import { Router } from 'express';
import { optionalAuth, requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as controller from './users.controller.js';
import {
	changeEmailSchema,
	changePasswordSchema,
	paginationQuerySchema,
	updateMeSchema,
	updateSettingsSchema,
	usernameParamSchema,
} from './users.schema.js';

export const usersRouter = Router();

usersRouter.patch('/me', requireAuth, validate({ body: updateMeSchema }), controller.updateMe);
usersRouter.get('/me/settings', requireAuth, controller.getSettings);
usersRouter.patch('/me/settings', requireAuth, validate({ body: updateSettingsSchema }), controller.updateSettings);
usersRouter.patch('/me/email', requireAuth, validate({ body: changeEmailSchema }), controller.changeEmail);
usersRouter.patch('/me/password', requireAuth, validate({ body: changePasswordSchema }), controller.changePassword);
usersRouter.get('/:username', optionalAuth, validate({ params: usernameParamSchema }), controller.getProfile);
usersRouter.get('/:username/followers', optionalAuth, validate({ params: usernameParamSchema }), controller.listFollowers);
usersRouter.get('/:username/following', optionalAuth, validate({ params: usernameParamSchema }), controller.listFollowing);
usersRouter.get('/:username/ratings', optionalAuth, validate({ params: usernameParamSchema, query: paginationQuerySchema }), controller.listRatings);
usersRouter.get('/:username/reviews', optionalAuth, validate({ params: usernameParamSchema, query: paginationQuerySchema }), controller.listReviews);
usersRouter.post('/:username/follow', requireAuth, validate({ params: usernameParamSchema }), controller.follow);
usersRouter.delete('/:username/follow', requireAuth, validate({ params: usernameParamSchema }), controller.unfollow);
