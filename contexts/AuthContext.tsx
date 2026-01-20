import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { User as AppUser, UserRole } from '../types';



import { AuthContext, AuthContextType } from './AuthContextDefinition';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const mapUser = (sbUser: SupabaseUser | null): AppUser | null => {
        if (!sbUser) return null;
        const name = sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User';
        return {
            id: sbUser.id,
            email: sbUser.email || '',
            name: name,
            role: (sbUser.user_metadata?.role as UserRole) || UserRole.MEMBER,
            avatar: sbUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sbUser.id}`
        };
    };

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(mapUser(session?.user ?? null));
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(mapUser(session?.user ?? null));
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        // State update happens via onAuthStateChange
    };

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    return (
        <AuthContext.Provider value={{ session, user, signOut, loading, openAuthModal, closeAuthModal, isAuthModalOpen }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


