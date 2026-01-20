import { createContext, useContext } from 'react';
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
