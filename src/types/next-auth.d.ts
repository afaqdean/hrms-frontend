import type { DefaultSession, DefaultUser } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  type Session = {
    user: any & DefaultSession['user'];
    accessToken?: string;
    error?: string;
  } & DefaultSession;

  type User = {
    id: string;
    email: string;
    name: string;
    role: any;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  } & DefaultUser;
}

declare module 'next-auth/jwt' {
  type JWT = {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: any;
    error?: string;
  } & DefaultJWT;
}
