'use server';

import {db} from '@/lib/db';

export default async function getUserByEmail(email: string) {
  try {
    return await db.user.findUnique({where: {email}});
  } catch {
    return null;
  }
}
