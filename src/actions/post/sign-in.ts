'use server';

import {SignInFormFields, SignInValidationSchema} from '@/types/forms';
import getUserByEmail from '@/actions/get/get-user-by-email';
import {signIn as authSignIn} from '@/../auth';
import {AuthError} from 'next-auth';

export default async function signIn({
  data,
  callbackURL,
}: {
  data: SignInFormFields;
  callbackURL?: string;
}) {
  const validationResult = SignInValidationSchema.safeParse(data);
  if (!validationResult.success) {
    return {error: 'Invalid fields'};
  }
  const {email, password} = validationResult.data;
  const candidate = await getUserByEmail(email);
  if (!candidate || !candidate.password || !candidate.password) return {error: 'User not found'};

  try {
    await authSignIn('credentials', {email, password, redirectTo: callbackURL});
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {error: 'Invalid credentials'};
        default:
          return {error: 'Something went wrong'};
      }
    }
    throw error;
  }
  return;
}
