import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { account, databases, DATABASE_ID, USERS_COLLECTION } from '../../config/appwrite';
import { ID } from 'appwrite';
import toast from 'react-hot-toast';

export const SignupForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        // Validate password strength
        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);
        try {
            // Step 1: Create the account
            const userAccount = await account.create(
                ID.unique(),
                formData.email,
                formData.password,
                formData.name
            );

            // Step 2: Create user document in database
            await databases.createDocument(
                DATABASE_ID,
                USERS_COLLECTION,
                userAccount.$id,
                {
                    userId: userAccount.$id,
                    name: formData.name,
                    email: formData.email,
                    createdAt: new Date().toISOString()
                }
            );

            // Step 3: Create email session
            await account.createEmailSession(formData.email, formData.password);
            
            toast.success('Account created successfully!');
            navigate('/user-type');
        } catch (error: any) {
            console.error('Signup error:', error);
            
            // Provide more specific error messages
            if (error.code === 409) {
                toast.error('Email already exists. Please use a different email.');
            } else if (error.code === 400) {
                toast.error('Invalid email or password format.');
            } else {
                toast.error('Failed to create account. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-lime-100 to-orange-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-lime-600">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-lime-500" />
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="pl-10 w-full p-2 border border-lime-200 rounded focus:outline-none focus:border-lime-500"
                            placeholder="Full Name"
                            required
                            minLength={2}
                        />
                    </div>
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
                            placeholder="Password (min. 8 characters)"
                            required
                            minLength={8}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-lime-500" />
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="pl-10 w-full p-2 border border-lime-200 rounded focus:outline-none focus:border-lime-500"
                            placeholder="Confirm Password"
                            required
                            minLength={8}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-lime-500 text-white py-2 rounded hover:bg-lime-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <UserPlus className="h-5 w-5" />
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-lime-600 hover:text-lime-700">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};