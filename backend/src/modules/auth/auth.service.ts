import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { signToken } from '../../utils/jwt.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

const SALT_ROUNDS = 12;

const publicUserSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  bio: true,
  avatarUrl: true,
  createdAt: true,
} as const;

export const register = async (input: RegisterInput) => {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
  });
  if (existing) {
    throw AppError.conflict(
      existing.email === input.email ? 'Este e-mail já está em uso' : 'Este nome de usuário já está em uso',
    );
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name: input.name, username: input.username, email: input.email, passwordHash },
    select: publicUserSelect,
  });

  const token = signToken({ sub: user.id, username: user.username });
  return { user, token };
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw AppError.unauthorized('E-mail ou senha incorretos');

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw AppError.unauthorized('E-mail ou senha incorretos');

  const token = signToken({ sub: user.id, username: user.username });
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return { user: publicUser, token };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
  if (!user) throw AppError.notFound('Usuário não encontrado');
  return user;
};
