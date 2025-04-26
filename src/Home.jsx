import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import DOMPurify from 'dompurify';
import { getBase64 } from './unity/imageHelper';

const Home = () => {
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
      const prompt = 'Given a clear image of a person, analyze their facial features, face shape, and skin tone to provide smart and personalized style advice. Suggest a suitable hairstyle that matches their face shape (e.g., oval, round, square), recommend ideal clothing colors that complement their skin tone (e.g., pastel blue, earth tones, deep olive, cool grey), and identify the best sunglasses style (e.g., aviator, wayfarer, round) based on their face geometry. Include visual examples or generated sample images showing the suggested hairstyles, dress colors, and sunglasses styles on a similar model or overlaid onto the original image. Also, offer additional smart suggestions such as accessory types, beard styles (if applicable), or makeup tones to enhance their appearance';
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
        image: selectedImage,
        response: text,
        timestamp: new Date().toISOString(),
      };
      history.unshift(newEntry);
      localStorage.setItem('smartAdvisorHistory', JSON.stringify(history.slice(0, 10)));
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to process the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text) => {
    // Split the text into paragraphs based on double newlines
    const paragraphs = text.split('\n\n').map((paragraph, index) => {
      // Split each paragraph into lines based on single newlines
      const lines = paragraph.split('\n').map((line, lineIndex) => {
        // Sanitize the line and handle bold text
        let formattedLine = DOMPurify.sanitize(line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'));

        // Handle headings (e.g., **Clothing:**)
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <h4
              key={`${index}-${lineIndex}`}
              className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-white border-l-4 border-blue-600 pl-2"
            >
              <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/\*\*/g, '') }} />
            </h4>
          );
        }

        // Handle bullet points (e.g., * Colors: or • Colors:)
        if (line.startsWith('* ') || line.startsWith('• ')) {
          const subItems = [];
          let currentLineIndex = lineIndex + 1;

          // Collect sub-bullets (lines starting with - or •)
          while (
            currentLineIndex < paragraph.split('\n').length &&
            (paragraph.split('\n')[currentLineIndex].startsWith('  • ') ||
             paragraph.split('\n')[currentLineIndex].startsWith('- '))
          ) {
            const subLine = paragraph.split('\n')[currentLineIndex];
            const formattedSubLine = DOMPurify.sanitize(subLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'));
            subItems.push(
              <li
                key={`${index}-${currentLineIndex}`}
                className="ml-6 text-gray-600 dark:text-gray-300"
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: formattedSubLine.replace(/^  • |^- /, ''),
                  }}
                />
              </li>
            );
            currentLineIndex++;
          }

          // Update lineIndex to skip the processed sub-bullets
          if (subItems.length > 0) {
            lineIndex = currentLineIndex - 1;
          }

          return (
            <div key={`${index}-${lineIndex}`}>
              <li className="ml-4 text-gray-600 dark:text-gray-300">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formattedLine.replace(/^\* |• /, ''),
                  }}
                />
              </li>
              {subItems.length > 0 && (
                <ul className="mt-1 mb-2">{subItems}</ul>
              )}
            </div>
          );
        }

        // Default to paragraph
        return (
          <p
            key={`${index}-${lineIndex}`}
            className="mb-2 text-gray-600 dark:text-gray-300"
          >
            <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          </p>
        );
      });

      return <div key={index} className="mb-4">{lines}</div>;
    });

    return paragraphs;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 pt-16 sm:pt-20">
      <div className="w-full max-w-lg px-4 sm:px-0">
        <form
          className="bg-gray-50 dark:bg-gray-900 hover:dark:bg-gray-400 hover:bg-gray-900 shadow-md rounded-lg p-8"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
            Smart Advisor
          </h2>

          <div className="mb-4">
            <label
              htmlFor="image-upload"
              className="block text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2"
            >
              Click to Choose Image
            </label>
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
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('image-upload').click()}
              tabIndex={0}
              className={`w-full h-48 sm:h-64 border-dashed border-2 p-4 flex items-center justify-center cursor-pointer ${selectedImage ? '' : 'bg-gray-100 dark:bg-gray-700'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              role="button"
              aria-label="Choose an image"
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

          <div className="mb-6">
            <label className="block text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
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

          <button
            type="submit"
            className={`w-full sm:w-auto py-2 px-4 rounded transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>

          {error && (
            <p className="mt-4 text-red-500 text-center" role="alert">
              {error}
            </p>
          )}
        </form>

        {aiResponse && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Hello {name}, here is the Smart Advice for your image:
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Note: Visual examples are not currently available but will be added in future updates.
            </p>
            <div className="text-gray-600 dark:text-gray-300">{formatResponse(aiResponse)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;