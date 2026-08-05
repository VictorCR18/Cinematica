import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { logActivity } from '../activity/activity.service.js';

const profileSelect = {
  id: true,
  name: true,
  username: true,
  bio: true,
  avatarUrl: true,
  createdAt: true,
} as const;

export const getProfileByUsername = async (username: string, viewerId?: string) => {
  const user = await prisma.user.findUnique({ where: { username }, select: profileSelect });
  if (!user) throw AppError.notFound('Usuário não encontrado');

  const [ratingsCount, reviewsCount, diaryCount, followersCount, followingCount, isFollowedByViewer] = await Promise.all([
    prisma.rating.count({ where: { userId: user.id } }),
    prisma.review.count({ where: { userId: user.id } }),
    prisma.diaryEntry.count({ where: { userId: user.id } }),
    prisma.follow.count({ where: { followingId: user.id } }),
    prisma.follow.count({ where: { followerId: user.id } }),
    viewerId
      ? prisma.follow.findUnique({ where: { followerId_followingId: { followerId: viewerId, followingId: user.id } } })
      : Promise.resolve(null),
  ]);

  return {
    ...user,
    stats: { ratingsCount, reviewsCount, diaryCount, followersCount, followingCount },
    isFollowedByViewer: Boolean(isFollowedByViewer),
    isViewer: viewerId === user.id,
  };
};

export const updateMe = (userId: string, data: { name?: string; bio?: string; avatarUrl?: string }) =>
  prisma.user.update({ where: { id: userId }, data, select: profileSelect });

export const follow = async (followerId: string, targetUsername: string) => {
  const target = await prisma.user.findUnique({ where: { username: targetUsername } });
  if (!target) throw AppError.notFound('Usuário não encontrado');
  if (target.id === followerId) throw AppError.badRequest('Você não pode seguir a si mesmo');

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId, followingId: target.id } },
    create: { followerId, followingId: target.id },
    update: {},
  });

  await logActivity({ type: 'FOLLOW', userId: followerId, refId: target.id });
  return { following: true };
};

export const unfollow = async (followerId: string, targetUsername: string) => {
  const target = await prisma.user.findUnique({ where: { username: targetUsername } });
  if (!target) throw AppError.notFound('Usuário não encontrado');

  await prisma.follow.deleteMany({ where: { followerId, followingId: target.id } });
  return { following: false };
};

export const listFollowers = async (username: string) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw AppError.notFound('Usuário não encontrado');

  const follows = await prisma.follow.findMany({
    where: { followingId: user.id },
    include: { follower: { select: profileSelect } },
    orderBy: { createdAt: 'desc' },
  });
  return follows.map((f) => f.follower);
};

export const listFollowing = async (username: string) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw AppError.notFound('Usuário não encontrado');

  const follows = await prisma.follow.findMany({
    where: { followerId: user.id },
    include: { following: { select: profileSelect } },
    orderBy: { createdAt: 'desc' },
  });
  return follows.map((f) => f.following);
};
