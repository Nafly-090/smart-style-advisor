import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getBase64 } from './unity/imageHelper';

const ImageUploadForm = () => {
    const [name, setName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [aiResponse, setAiResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const genAI = new GoogleGenerativeAI("AIzaSyCIorVdfyAN9AVTx4tdTqT0vQRfyErRhEk");
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
            setAiResponse('');
            setError('');
        }
    };




    const handleSubmit = async (event) => {
        event.preventDefault();
      
        if (!imageFile) {
          setError('Please upload an image.');
          return;
        }
      
        setLoading(true);
        setError('');
      
        try {
          const base64Image = await getBase64(imageFile);
          const prompt = 'Given a clear image of a person, analyze their facial features, face shape, and skin tone to provide smart and personalized style advice...';
          const imagePart = {
            inlineData: {
              data: base64Image,
              mimeType: imageFile.type,
            },
          };
          const result = await model.generateContent([prompt, imagePart]);
          const response = await result.response;
          const text = response.text();
          setAiResponse(text);
      
          // Save to history
          const history = JSON.parse(localStorage.getItem('smartAdvisorHistory') || '[]');
          const newEntry = {
            name,
            image: selectedImage, // Store base64 image
            response: text,
            timestamp: new Date().toISOString(),
          };
          history.unshift(newEntry); // Add to the beginning
          localStorage.setItem('smartAdvisorHistory', JSON.stringify(history.slice(0, 10))); // Limit to 10 entries
        } catch (err) {
          console.error('Error:', err);
          setError('Failed to process the image. Please try again.');
        } finally {
          setLoading(false);
        }
      };

    // Function to format the AI response with new lines and bold text
    const formatResponse = (text) => {
        // Split the text into paragraphs based on double newlines
        const paragraphs = text.split('\n\n').map((paragraph, index) => {
            // Split each paragraph into lines based on single newlines
            const lines = paragraph.split('\n').map((line, lineIndex) => {
                // Handle bold text (e.g., * **The Men:**)
                const formattedLine = line.replace(/\* \*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Handle bullet points (e.g., * **The Men:** or * text)
                if (line.startsWith('* ')) {
                    return (
                        <li key={`${index}-${lineIndex}`} className="ml-4">
                            <span dangerouslySetInnerHTML={{ __html: formattedLine.replace('* ', '') }} />
                        </li>
                    );
                }
                return (
                    <p key={`${index}-${lineIndex}`} className="mb-2">
                        <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
                    </p>
                );
            });

            return lines;
        });

        return paragraphs;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-lg">
                <form
                    className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Smart Advisor</h2>

                    {/* Image Preview Area */}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Click to Choose Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                            disabled={loading}
                        />
                        <div
                            onClick={() => document.getElementById('image-upload').click()}
                            className={`w-full h-48 border-dashed border-2 p-4 flex items-center justify-center cursor-pointer ${selectedImage ? '' : 'bg-gray-100 dark:bg-gray-700'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt="Selected"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <span className="text-gray-600 dark:text-gray-300">Click to choose an image</span>
                            )}
                        </div>
                    </div>

                    {/* Name Field */}
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your name"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Submit'}
                    </button>

                    {/* Error Message */}
                    {error && (
                        <p className="mt-4 text-red-500 text-center">{error}</p>
                    )}
                </form>

                {/* AI Response with Name */}
                {aiResponse && (
                    <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                            Hello {name}, here is the Smart Advice of your image:
                        </h3>
                        <div className="text-gray-600 dark:text-gray-300">
                            {formatResponse(aiResponse)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploadForm;


