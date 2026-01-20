import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onClose();
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('註冊成功！請檢查您的信箱進行驗證，或直接登入 (如果已關閉驗證)。');
                setIsLogin(true);
            }
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                    <h3 className="text-xl font-bold serif-font text-gray-900 dark:text-gray-100">
                        {isLogin ? '歡迎回來' : '註冊帳號'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium shadow-sm transition-all disabled:opacity-50"
                    >
                        {loading ? '處理中...' : (isLogin ? '登入' : '註冊')}
                    </button>

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        {isLogin ? '還沒有帳號？' : '已經有帳號？'}
                        <button
                            type="button"
                            className="text-indigo-600 dark:text-indigo-400 font-bold ml-1 hover:underline"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? '立即註冊' : '登入'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
