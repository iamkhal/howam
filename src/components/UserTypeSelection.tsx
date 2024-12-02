import React from 'react';
import { User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type UserTypeSelectionProps = {
    onSelect: (type: 'teen' | 'parent') => void;
};

export const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelect }) => {
    const navigate = useNavigate();

    const handleUserTypeSelection = (type: 'teen' | 'parent') => {
        onSelect(type);
        navigate('/chat');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-lime-100 to-orange-100">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-lime-600">
                    Choose Your Category
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                    Select your category to begin your chat session.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => handleUserTypeSelection('teen')}
                        className="w-full p-4 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors flex items-center justify-center gap-3"
                    >
                        <User className="h-6 w-6" />
                        I'm a Teen
                    </button>
                    <button
                        onClick={() => handleUserTypeSelection('parent')}
                        className="w-full p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-3"
                    >
                        <Users className="h-6 w-6" />
                        I'm a Parent
                    </button>
                </div>
            </div>
        </div>
    );
};