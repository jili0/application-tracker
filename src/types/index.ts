import { Session } from 'next-auth';

// Extend the Session type to include user ID
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export interface IApplication {
  _id?: string;
  date: string;
  company: string;
  position: string;
  status: 'answered' | 'no-answer' | 'rejected';
  remarks: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ApplicationFormData = Omit<IApplication, '_id' | 'userId' | 'createdAt' | 'updatedAt'>;

export interface SearchState {
  date: string;
  company: string;
  position: string;
  status: string;
  remarks: string;
}