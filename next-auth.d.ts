import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      isadmin: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    passwd?: string;
    isadmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isadmin: boolean;
  }
}
