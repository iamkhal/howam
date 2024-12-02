export type UserType = 'teen' | 'parent';

export type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export type User = {
    id: string;
    email: string;
    name?: string;
    userType?: UserType;
};