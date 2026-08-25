import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { signToken } from '../../utils/jwt.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

const SALT_ROUNDS = 12;

const DUMMY_HASH = '$2a$12$C6UzMDM.H6dfI/f/IKcEeO0rRJlKQMFJKeOFQFvKVDX3l/HAYb2Xa';

const publicUserSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  bio: true,
  avatarUrl: true,
  createdAt: true,
} as const;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const register = async (input: RegisterInput) => {
  const email = normalizeEmail(input.email);

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username: input.username }] },
  });
  if (existing) {
    throw AppError.conflict(
      existing.email === email ? 'Este e-mail já está em uso' : 'Este nome de usuário já está em uso',
    );
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name: input.name, username: input.username, email, passwordHash },
    select: publicUserSelect,
  });

  const token = signToken({ sub: user.id, username: user.username });
  return { user, token };
};

export const login = async (input: LoginInput) => {
  const email = normalizeEmail(input.email);
  const user = await prisma.user.findUnique({ where: { email } });

  const valid = await bcrypt.compare(input.password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !valid) throw AppError.unauthorized('E-mail ou senha incorretos');

  const token = signToken({ sub: user.id, username: user.username });
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return { user: publicUser, token };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
  if (!user) throw AppError.notFound('Usuário não encontrado');
  return user;
};