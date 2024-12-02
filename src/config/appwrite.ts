import { Client, Account, Databases, Storage } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();

// Initialize services
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('674d22a90037c820e8ec');        // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Collection configurations
export const DATABASE_ID = '674d2c1200328d1b17c4';
export const CHAT_HISTORY_COLLECTION = '674d2c930001fe0f847d';
export const USERS_COLLECTION = 'user';
export const ASSETS_BUCKET = '674de04f0016c733a73b';

// Helper function to check if user is authenticated
export const checkAuth = async () => {
    try {
        const session = await account.getSession('current');
        return session;
    } catch (error) {
        return null;
    }
};