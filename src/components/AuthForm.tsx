import React, { useState } from 'react';
import { account } from '../config/appwrite';
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react';

type AuthFormProps = {
    isLogin?: boolean;
};

export const AuthForm: React.FC<AuthFormProps> = ({ isLogin = true }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await account.createEmailSession(email, password);
            } else {
                await account.create('unique()', email, password);
                await account.createEmailSession(email, password);
            }
        } catch (err) {
            setError('Authentication failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-lime-100 to-orange-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-lime-600">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-lime-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 w-full p-2 border border-lime-200 rounded focus:outline-none focus:border-lime-500"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-lime-500" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 w-full p-2 border border-lime-200 rounded focus:outline-none focus:border-lime-500"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-lime-500 text-white py-2 rounded hover:bg-lime-600 transition-colors flex items-center justify-center gap-2"
                    >
                        {isLogin ? (
                            <>
                                <LogIn className="h-5 w-5" />
                                Sign In
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-5 w-5" />
                                Sign Up
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};