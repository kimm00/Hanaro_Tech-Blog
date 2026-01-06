import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isadmin: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    passwd?: string;
    isadmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    isadmin: boolean;
  }
}
