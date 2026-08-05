import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('cinema123', 12);

  const demo = await prisma.user.upsert({
    where: { email: 'demo@cinematica.app' },
    update: {},
    create: {
      name: 'Usuário Demo',
      username: 'demo',
      email: 'demo@cinematica.app',
      passwordHash,
      bio: 'Cinéfilo explorando o Cinemática 🎬',
    },
  });

  console.log('✅ Usuário de demonstração criado:', demo.username, '(senha: cinema123)');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
