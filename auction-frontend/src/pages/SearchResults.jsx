import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const query = searchParams.get('q');
        if (!query) {
          setResults([]);
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch search results');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">
        Search Results for "{searchParams.get('q')}"
      </h1>
      
      {results.length === 0 ? (
        <div className="text-center text-gray-600">
          No results found. Try different keywords.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <div
              key={item._id}
              className="p-4 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-48 mb-4 rounded"
                />
              )}
              <h2 className="mb-2 text-xl font-semibold text-gray-900">{item.name}</h2>
              {item.description && (
                <p className="mb-4 text-gray-600">{item.description}</p>
              )}
              {item.currentPrice && (
                <p className="text-lg font-bold text-indigo-600">
                  Current Price: ${item.currentPrice}
                </p>
              )}
              {item.category && (
                <span className="inline-block px-3 py-1 text-sm text-indigo-600 bg-indigo-100 rounded-full">
                  {item.category}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 