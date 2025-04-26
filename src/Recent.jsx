import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Recent = () => {
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('smartAdvisorHistory') || '[]');
    setHistory(storedHistory);
  }, []);

  // Clear history
  const clearHistory = () => {
    localStorage.removeItem('smartAdvisorHistory');
    setHistory([]);
  };

  // Toggle expanded view for an entry
  const toggleExpanded = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16 sm:pt-20 flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Recent Submissions
        </h2>
        {history.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            No recent submissions found.{' '}
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Submit a new image
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((entry, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 shadow-md rounded-lg p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  {entry.image && (
                    <img
                      src={entry.image}
                      alt={`Submission by ${entry.name}`}
                      className="w-full sm:w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {entry.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      {expanded === index
                        ? entry.response
                        : `${entry.response.slice(0, 150)}${
                            entry.response.length > 150 ? '...' : ''
                          }`}
                    </p>
                    {entry.response.length > 150 && (
                      <button
                        onClick={() => toggleExpanded(index)}
                        className="text-blue-600 dark:text-blue-400 hover:underline mt-2"
                      >
                        {expanded === index ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={clearHistory}
              className="w-full sm:w-auto mt-4 py-2 px-4 bg-red-600 text-white rounded transition hover:bg-red-700"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recent;