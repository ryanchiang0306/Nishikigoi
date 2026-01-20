
import { createContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { User as AppUser } from '../types';

export interface AuthContextType {
    session: Session | null;
    user: AppUser | null;
    signOut: () => Promise<void>;
    loading: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    isAuthModalOpen: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
