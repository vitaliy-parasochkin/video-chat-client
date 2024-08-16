'use server';

import {Code} from '@/types';
import {db} from '@/lib/db';

export default async function getMeetingByCode(code: Code) {
  try {
    return await db.meeting.findUnique({where: {code}});
  } catch {
    return null;
  }
}
