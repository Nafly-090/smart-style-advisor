import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getBase64 } from '../unity/imageHelper';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize Gemini API with your API key
  const genAI = new GoogleGenerativeAI("AIzaSyCIorVdfyAN9AVTx4tdTqT0vQRfyErRhEk");
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setAiResponse(''); // Clear previous response
      setError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert image to Base64
      const base64Image = await getBase64(image);

      // Prepare the prompt and image data
      const prompt = '';
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: image.type, // e.g., 'image/jpeg'
        },
      };

      // Send request to Gemini API
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      setAiResponse(text);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to process the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Image Description Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="imageInput">Upload Image:</label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
        </div>
        <button type="submit"  disabled={loading || !image}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {aiResponse && (
        <div style={{ marginTop: '20px' }}>
          <h2>Description:</h2>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;