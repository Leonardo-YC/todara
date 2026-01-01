/**
 * NextAuth instance
 * Export auth helpers for use throughout the app
 */

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);