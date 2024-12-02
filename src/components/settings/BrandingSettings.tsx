import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image } from 'lucide-react';
import { storage, ASSETS_BUCKET } from '../../config/appwrite';
import { ID } from 'appwrite';
import toast from 'react-hot-toast';

export const BrandingSettings: React.FC = () => {
    const onDrop = useCallback(async (acceptedFiles: File[], type: 'logo' | 'favicon') => {
        const file = acceptedFiles[0];
        if (!file) return;

        try {
            const fileId = ID.unique();
            await storage.createFile(ASSETS_BUCKET, fileId, file);
            
            const fileUrl = storage.getFileView(ASSETS_BUCKET, fileId);
            
            if (type === 'favicon') {
                const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = fileUrl.href;
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            
            toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} updated successfully!`);
        } catch (error) {
            toast.error('Failed to upload file. Please try again.');
        }
    }, []);

    const { getRootProps: getLogoProps, getInputProps: getLogoInputProps } = useDropzone({
        onDrop: (files) => onDrop(files, 'logo'),
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const { getRootProps: getFaviconProps, getInputProps: getFaviconInputProps } = useDropzone({
        onDrop: (files) => onDrop(files, 'favicon'),
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Branding Settings</h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website Logo
                    </label>
                    <div
                        {...getLogoProps()}
                        className="border-2 border-dashed border-lime-300 rounded-lg p-6 text-center hover:border-lime-500 transition-colors cursor-pointer"
                    >
                        <input {...getLogoInputProps()} />
                        <Image className="mx-auto h-12 w-12 text-lime-500" />
                        <p className="mt-2 text-sm text-gray-600">
                            Drag and drop your logo here, or click to select a file
                        </p>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favicon
                    </label>
                    <div
                        {...getFaviconProps()}
                        className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors cursor-pointer"
                    >
                        <input {...getFaviconInputProps()} />
                        <Image className="mx-auto h-12 w-12 text-orange-500" />
                        <p className="mt-2 text-sm text-gray-600">
                            Drag and drop your favicon here, or click to select a file
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};