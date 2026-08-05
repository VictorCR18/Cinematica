import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as usersService from './users.service.js';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params as { username: string };
  res.json(await usersService.getProfileByUsername(username, req.user?.id));
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  res.json(await usersService.updateMe(req.user!.id, req.body));
});

export const follow = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params as { username: string };
  res.status(201).json(await usersService.follow(req.user!.id, username));
});

export const unfollow = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params as { username: string };
  res.json(await usersService.unfollow(req.user!.id, username));
});

export const listFollowers = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params as { username: string };
  res.json(await usersService.listFollowers(username));
});

export const listFollowing = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params as { username: string };
  res.json(await usersService.listFollowing(username));
});
