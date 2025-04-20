import React, { useState } from 'react';

const ImageUploadForm = () => {
    // State for name and image
    const [name, setName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    // Handle the name input change
    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    // Handle image file selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Here you can send the form data to your server or handle it as needed
        console.log("Name:", name);
        console.log("Image:", selectedImage);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <form 
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-lg"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Smart Advisor</h2>

                {/* Image Preview Area */}
                <div className="mb-4">
                    
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Click to Choose Image</label>

                    {/* The file input is hidden but triggered by clicking the image preview */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                    />

                    {/* Image Preview Section (acts as clickable area) */}
                    <div
                        onClick={() => document.getElementById('image-upload').click()}
                        className={`w-full h-48 border-dashed border-2 p-4 flex items-center justify-center cursor-pointer ${selectedImage ? '' : 'bg-gray-100 dark:bg-gray-700'}`}
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
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ImageUploadForm;
