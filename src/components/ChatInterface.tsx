import React, { useState, useEffect, useRef } from 'react';
import { Send, History, ExternalLink } from 'lucide-react';
import { openai, TEEN_PROMPT, PARENT_PROMPT } from '../config/openai';
import { databases, DATABASE_ID, CHAT_HISTORY_COLLECTION } from '../config/appwrite';
import { FORM_URLS } from '../config/forms';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

type ChatInterfaceProps = {
    userType: 'teen' | 'parent';
    userId: string;
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ userType, userId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasCompletedForm, setHasCompletedForm] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFormCompletion = () => {
        setHasCompletedForm(true);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        if (!hasCompletedForm) {
            alert('Please complete the form before starting the chat.');
            return;
        }

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const prompt = userType === 'teen' ? TEEN_PROMPT : PARENT_PROMPT;
            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: prompt },
                    ...messages,
                    userMessage
                ]
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.choices[0].message.content || ''
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Save to Appwrite
            await databases.createDocument(
                DATABASE_ID,
                CHAT_HISTORY_COLLECTION,
                'unique()',
                {
                    userId,
                    userType,
                    message: userMessage.content,
                    response: assistantMessage.content,
                    timestamp: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!hasCompletedForm) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-lime-50 to-orange-50">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-6 text-center text-lime-600">
                        Complete the Form
                    </h2>
                    <p className="text-gray-600 mb-6 text-center">
                        Please complete this brief survey before starting your chat session.
                    </p>
                    <div className="space-y-4">
                        <a
                            href={FORM_URLS[userType]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full p-4 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors flex items-center justify-center gap-3"
                        >
                            Open Form
                            <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                            onClick={handleFormCompletion}
                            className="w-full p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            I've Completed the Form
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-r from-lime-50 to-orange-50">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                                message.role === 'user'
                                    ? 'bg-lime-500 text-white'
                                    : 'bg-white shadow-md'
                            }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white shadow-md rounded-lg p-3">
                            Typing...
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-white border-t">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 p-2 border border-lime-200 rounded-lg focus:outline-none focus:border-lime-500"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="bg-lime-500 text-white p-2 rounded-lg hover:bg-lime-600 transition-colors"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};