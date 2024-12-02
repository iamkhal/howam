import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { account } from '../../config/appwrite';
import toast from 'react-hot-toast';

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await account.createEmailSession(formData.email, formData.password);
            toast.success('Logged in successfully!');
            navigate('/user-type');
        } catch (error) {
            toast.error('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-lime-100 to-orange-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-lime-600">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-lime-500" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10 w-full p-2 border border-lime-200 rounded focus:outline-none focus:border-lime-500"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-lime-500" />
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10 w-full p-2 border border-lime-200 rounded focus:outline-none focus:border-lime-500"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-lime-500 text-white py-2 rounded hover:bg-lime-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <LogIn className="h-5 w-5" />
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-lime-600 hover:text-lime-700">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};