import NextAuth, { AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { prisma } from './prisma';
import { comparePassword } from './validator';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: '이메일', type: 'email', placeholder: 'user@mail.com' },
        passwd: {
          label: 'Password',
          type: 'password',
          placeholder: 'password...',
        },
      },
      async authorize(credentials) {
        console.log('🚀 ~ credentials:', credentials);
        const { email, passwd } = credentials;
        return {
          email: email as string,
          passwd: passwd as string,
        };
      },
    }),
    Google,
    Github,
  ],
  callbacks: {
    async signIn({ user, account }) {
      const { email, passwd, name, image } = user;

      if (!email) {
        throw makeAuthError('EmailSignInError', 'Email is required');
      }

      let oldUser = await prisma.user.findUnique({
        where: { email },
      });

      // ✅ Credentials 로그인
      if (account?.provider === 'credentials') {
        if (!oldUser)
          throw makeAuthError('EmailSignInError', 'Not Exists Email');

        if (
          passwd &&
          oldUser.passwd &&
          !(await comparePassword(passwd, oldUser.passwd))
        )
          throw makeAuthError('EmailSignInError', 'Invalid Email or Password');
      }

      // ✅ 핵심: 어떤 provider든 User 레코드 보장
      if (!oldUser) {
        oldUser = await prisma.user.create({
          data: {
            email,
            name: name ?? '',
            image,
          },
        });
      }

      // 세션에 DB 기준 정보 주입
      user.id = String(oldUser.id);
      user.name = oldUser.name;
      user.image = oldUser.image;
      (user as any).isadmin = oldUser.isadmin;

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // console.log('🚀 jwt - token:', token);
      // console.log('🚀 jwt - user:', user);
      // if (trigger) console.log('🚀 jwt - trigger:', trigger, session);
      const userData = trigger === 'update' ? session : user;
      if (userData) {
        token.id = userData.id;
        token.email = userData.email;
        token.name = userData.name;
        token.image = userData.image;
        token.isadmin = (userData as any).isadmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = String(token.id);
        session.user.email = String(token.email);
        session.user.name = token.name;
        session.user.image = String(token.image || token.picture);
        session.user.isadmin = Boolean(token.isadmin);
      }
      // console.log('🚀 ~ session:', session);
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
  jwt: { maxAge: 30 * 60 },
});

const makeAuthError = (type: AuthError['type'], message?: string) => {
  const err = new AuthError(message);
  err.type = type;
  return err;
};
