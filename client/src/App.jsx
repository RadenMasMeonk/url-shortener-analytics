import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedResult, setShortenedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Submit Form Shorten URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortenedResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/shorten`, {
        originalUrl: originalUrl
      });
      setShortenedResult(response.data.data);
      setOriginalUrl('');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memperpendek URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🔗 URL Shortener with Analytics</h1>
      
      {/* Form Input URL */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="url"
          placeholder="Masukkan URL panjang di sini (cth: https://github.com)..."
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
          style={{ flex: 1, padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Processing...' : 'Shorten'}
        </button>
      </form>

      {/* Pesan Error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Hasil URL Pendek */}
      {shortenedResult && (
        <div style={{ padding: '15px', backgroundColor: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '6px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Short Url are ready!</p>
          <p style={{ margin: '8px 0' }}>
            Original URL: <a href={shortenedResult.originalUrl} target="_blank" rel="noreferrer">{shortenedResult.originalUrl}</a>
          </p>
          <p style={{ margin: 0 }}>
            Short URL:{' '}
            <a href={shortenedResult.shortUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 'bold', color: '#0070f3' }}>
              {shortenedResult.shortUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;