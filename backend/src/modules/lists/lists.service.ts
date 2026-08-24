import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { ensureMovieCached } from '../movies/movies.service.js';
import { logActivity } from '../activity/activity.service.js';

const include = {
  items: { include: { movie: true }, orderBy: { position: 'asc' as const } },
  user: { select: { id: true, name: true, username: true, avatarUrl: true } },
};

export const createList = async (userId: string, input: { name: string; description?: string; isPublic: boolean }) => {
  const list = await prisma.list.create({ data: { userId, ...input }, include });
  await logActivity({ type: 'LIST_CREATED', userId, refId: list.id });
  return list;
};

export const listListsByUsername = async (username: string, viewerId?: string) => {
  const user = await prisma.user.findUnique({ where: { username }, select: { id: true, listsPublic: true } });
  if (!user) throw AppError.notFound('Usuário não encontrado');
  if (!user.listsPublic && viewerId !== user.id) return [];

  return prisma.list.findMany({
    where: { userId: user.id, ...(viewerId === user.id ? {} : { isPublic: true }) },
    include,
    orderBy: { createdAt: 'desc' },
  });
};

export const getListById = async (id: string, viewerId?: string) => {
  const list = await prisma.list.findUnique({ where: { id }, include });
  if (!list) throw AppError.notFound('Lista não encontrada');
  if (!list.isPublic && list.userId !== viewerId) throw AppError.forbidden('Esta lista é privada');
  return list;
};

const assertOwner = async (id: string, userId: string) => {
  const list = await prisma.list.findUnique({ where: { id } });
  if (!list) throw AppError.notFound('Lista não encontrada');
  if (list.userId !== userId) throw AppError.forbidden('Você só pode editar suas próprias listas');
  return list;
};

export const updateList = async (userId: string, id: string, data: Partial<{ name: string; description?: string; isPublic: boolean }>) => {
  await assertOwner(id, userId);
  return prisma.list.update({ where: { id }, data, include });
};

export const deleteList = async (userId: string, id: string) => {
  await assertOwner(id, userId);
  await prisma.list.delete({ where: { id } });
  return { deleted: true };
};

export const addItem = async (userId: string, listId: string, tmdbId: number, note?: string) => {
  await assertOwner(listId, userId);
  const movie = await ensureMovieCached(tmdbId);
  const count = await prisma.listItem.count({ where: { listId } });

  return prisma.listItem.upsert({
    where: { listId_movieId: { listId, movieId: movie.id } },
    create: { listId, movieId: movie.id, note, position: count },
    update: { note },
    include: { movie: true },
  });
};

export const removeItem = async (userId: string, listId: string, tmdbId: number) => {
  await assertOwner(listId, userId);
  const movie = await prisma.movie.findUnique({ where: { tmdbId } });
  if (!movie) return { deleted: false };

  await prisma.listItem.deleteMany({ where: { listId, movieId: movie.id } });
  return { deleted: true };
};
