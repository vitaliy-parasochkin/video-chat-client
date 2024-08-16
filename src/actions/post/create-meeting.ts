'use server';

import {CreateMeetingFields, CreateMeetingValidationSchema} from '@/types/forms';
import {generateCode} from '@/lib/utils';
import {auth} from '../../../auth';
import {db} from '@/lib/db';

export default async function createMeeting(data: CreateMeetingFields) {
  const session = await auth();

  if (!session) {
    return {error: 'Forbidden'};
  }

  const validationResult = CreateMeetingValidationSchema.safeParse(data);

  if (!validationResult.success) {
    return {error: 'Invalid name'};
  }

  const meeting = await db.meeting.create({
    data: {
      ownerId: session.user.id,
      code: generateCode(),
      name: data.name,
    },
  });
  return {success: meeting};
}
