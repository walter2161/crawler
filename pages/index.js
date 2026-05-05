import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [url, setUrl] = useState('');
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCrawl = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/crawl', { url });
      setJobId(response.data.jobId);
      setStatus('submitted');
    } catch (err) {
      setError(err.response?.data?.error || 'Error starting crawl');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!jobId) return;

    try {
      const response = await axios.get(`/api/status/${jobId}`);
      setStatus(response.data);
    } catch (err) {
      setError('Error checking status');
    }
  };

  const handleDownload = () => {
    if (jobId) {
      window.location.href = `/api/download/${jobId}`;
    }
  };

  return (
    <div style={styles.container}>
      <h1>Site Crawler</h1>
      <form onSubmit={handleCrawl} style={styles.form}>
        <input
          type="url"
          placeholder="Enter URL to crawl"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Starting...' : 'Start Crawl'}
        </button>
      </form>

      {jobId && (
        <div style={styles.jobInfo}>
          <p>Job ID: {jobId}</p>
          <button onClick={handleCheckStatus} style={styles.button}>
            Check Status
          </button>
          {status && (
            <div style={styles.status}>
              <p>Status: {status.status}</p>
              {status.status === 'completed' && (
                <button onClick={handleDownload} style={styles.button}>
                  Download Results
                </button>
              )}
              {status.error && <p style={styles.error}>Error: {status.error}</p>}
            </div>
          )}
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  jobInfo: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  status: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px'
  },
  error: {
    color: 'red',
    marginTop: '10px'
  }
};
