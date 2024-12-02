import React, { useState } from 'react';
import { User, Users, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FORM_URLS } from '../config/forms';
import toast from 'react-hot-toast';

type UserTypeSelectionProps = {
    onSelect: (type: 'teen' | 'parent') => void;
};

export const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelect }) => {
    const navigate = useNavigate();
    const [hasCompletedForm, setHasCompletedForm] = useState(false);

    const handleUserTypeSelection = (type: 'teen' | 'parent') => {
        // Open Google Form in a new window
        window.open(FORM_URLS[type], '_blank');
        
        // Show confirmation dialog
        const confirmed = window.confirm('Have you completed the form? Click OK only if you have submitted the form.');
        
        if (confirmed) {
            setHasCompletedForm(true);
            onSelect(type);
            navigate('/chat');
        } else {
            toast.error('Please complete the form before continuing');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-lime-100 to-orange-100">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-lime-600">
                    Choose Your Category
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                    Please select your category and complete a brief survey before starting.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => handleUserTypeSelection('teen')}
                        className="w-full p-4 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors flex items-center justify-center gap-3"
                    >
                        <User className="h-6 w-6" />
                        I'm a Teen
                        <ExternalLink className="h-4 w-4 ml-2" />
                    </button>
                    <button
                        onClick={() => handleUserTypeSelection('parent')}
                        className="w-full p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-3"
                    >
                        <Users className="h-6 w-6" />
                        I'm a Parent
                        <ExternalLink className="h-4 w-4 ml-2" />
                    </button>
                </div>
                <p className="mt-6 text-sm text-gray-500 text-center">
                    Note: You'll need to complete a brief survey before accessing the chat.
                </p>
            </div>
        </div>
    );
};