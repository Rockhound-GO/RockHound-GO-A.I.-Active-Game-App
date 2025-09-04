import React, { useState, useRef } from 'react';
import { LandListing } from '../types';

interface NewListingModalProps {
    onClose: () => void;
    onCreateListing: (newListingData: Omit<LandListing, 'id' | 'image'>, imageFile: File) => void;
}

const InputField: React.FC<{ id: string; label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; required?: boolean; isTextArea?: boolean; }> = 
({ id, label, value, onChange, type = "text", required = true, isTextArea = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        {isTextArea ? (
            <textarea
                id={id}
                name={id}
                value={value as string}
                onChange={onChange}
                required={required}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
        ) : (
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
        )}
    </div>
);

const NewListingModal: React.FC<NewListingModalProps> = ({ onClose, onCreateListing }) => {
    const [formData, setFormData] = useState({
        propertyName: '',
        landOwnerName: '',
        location: '',
        fee: 0,
        mineralsKnown: '', // Stored as a comma-separated string for simplicity
        accessRules: '',
        additionalNotes: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            alert("Please upload an image for the listing.");
            return;
        }
        const listingData = {
            ...formData,
            fee: Number(formData.fee) || 0,
            mineralsKnown: formData.mineralsKnown.split(',').map(s => s.trim()).filter(Boolean),
        };
        onCreateListing(listingData, imageFile);
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white text-center">Create New Land Listing</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        <InputField id="propertyName" label="Property Name" value={formData.propertyName} onChange={handleInputChange} />
                        <InputField id="landOwnerName" label="Your Name" value={formData.landOwnerName} onChange={handleInputChange} />
                        <InputField id="location" label="Location" value={formData.location} onChange={handleInputChange} />
                        <InputField id="fee" label="Access Fee ($/day)" value={formData.fee} onChange={handleInputChange} type="number" />
                        <InputField id="mineralsKnown" label="Known Minerals (comma-separated)" value={formData.mineralsKnown} onChange={handleInputChange} />
                        <InputField id="accessRules" label="Access Rules" value={formData.accessRules} onChange={handleInputChange} isTextArea />
                        <InputField id="additionalNotes" label="Additional Notes" value={formData.additionalNotes} onChange={handleInputChange} isTextArea required={false} />
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Property Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto object-cover rounded-md" />
                                    ) : (
                                        <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                    <div className="flex text-sm text-gray-500">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-amber-400 hover:text-amber-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-amber-500 px-2">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} ref={fileInputRef} required />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-right shrink-0">
                    <button 
                        onClick={onClose}
                        className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors mr-2"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-amber-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-500 transition-colors"
                    >
                        Create Listing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewListingModal;
