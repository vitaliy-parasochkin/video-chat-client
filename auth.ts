import {PrismaAdapter} from '@auth/prisma-adapter';
import authConfig from './auth.config';
import NextAuth from 'next-auth';
import {db} from '@/lib/db';

export const {
  handlers: {GET, POST},
  signIn,
  signOut,
  auth,
} = NextAuth({
  pages: {
    signIn: '/auth/sign-in/',
    error: '/auth/error/',
  },
  callbacks: {
    async session({session, token}) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {strategy: 'jwt'},
  adapter: PrismaAdapter(db),
  ...authConfig,
});
