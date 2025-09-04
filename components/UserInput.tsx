import React, { useState, useRef } from 'react';

interface UserInputProps {
  onSendMessage: (message: string, imageFile?: File) => void;
  isLoading: boolean;
}

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className={className}
    >
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
);

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        <path d="M12 4.5a7 7 0 100 14 7 7 0 000-14zM4 11a8 8 0 1116 0 8 8 0 01-16 0z" />
        <path d="M18.5 4.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
);


const UserInput: React.FC<UserInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleCamerClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
      if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
      }
      setImageFile(null);
      setImagePreview(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    const trimmedInput = inputValue.trim();

    if (!imageFile && !trimmedInput) {
        return; // Can't submit empty
    }

    if (imageFile) {
        // Existing logic for image submission
        const contextText = trimmedInput || "Please identify this specimen.";
        onSendMessage(contextText, imageFile);
        setInputValue('');
        clearImage();
    } else if (trimmedInput) {
        // New logic for text-only submission
        onSendMessage(trimmedInput); // Pass undefined for imageFile
        setInputValue('');
    }
  };

  return (
    <footer className="bg-gray-800/50 p-4 border-t border-gray-700">
      <div className="container mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="flex items-start space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleCamerClick}
            disabled={isLoading}
            className="bg-gray-700 text-gray-300 font-bold p-3 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400"
          >
           <CameraIcon className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            {imagePreview && (
              <div className="absolute bottom-full left-0 mb-2 p-1 bg-gray-600/50 rounded-lg">
                  <img src={imagePreview} alt="Selected specimen" className="h-20 w-20 object-cover rounded-md"/>
                  <button type="button" onClick={clearImage} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">&times;</button>
              </div>
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add context or ask a question..."
              disabled={isLoading}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || (!imageFile && !inputValue.trim())}
            className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold p-3 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400"
          >
           <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </footer>
  );
};

export default UserInput;