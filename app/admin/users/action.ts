'use server';

import { prisma } from '@/lib/server/prisma';

export async function getUsers(params: {
  q?: string;
  role?: 'admin' | 'user';
  out?: 'active' | 'out';
}) {
  const { q, role, out } = params;

  return prisma.user.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { email: { contains: q, mode: 'insensitive' } },
                { name: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
        role === 'admin'
          ? { isadmin: true }
          : role === 'user'
            ? { isadmin: false }
            : {},
        out === 'out'
          ? { outdt: { not: null } }
          : out === 'active'
            ? { outdt: null }
            : {},
      ],
    },
    orderBy: { id: 'desc' },
  });
}
