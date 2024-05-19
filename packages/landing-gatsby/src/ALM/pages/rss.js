import React, { useState } from 'react';
import { useFetchRSSQuery } from '../store/apiSlice';

const RSSReader = () => {
  const [url, setUrl] = useState('');
  const [displayMode, setDisplayMode] = useState('HTML');
  const { data, error, isLoading } = useFetchRSSQuery(url, {
    skip: !url || !url.startsWith('http'),
  });

  const toggleDisplayMode = () => {
    setDisplayMode(prevMode => prevMode === 'HTML' ? 'XML' : 'HTML');
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading the feed!</p>;

  return (
    <div>
      <button onClick={toggleDisplayMode}>
        Switch to {displayMode === 'HTML' ? 'XML' : 'HTML'}
      </button>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter RSS feed URL"
      />
      {data && (
        <div>
          {displayMode === 'HTML' ? (
            <>
              <h1>{data.feedTitle}</h1>
              <h2>{data.feedLink}</h2>
              <ul>
                {data.items.map((item, index) => (
                  <li key={index}>
                    {Object.entries(item).map(([key, value]) => (
                      <p key={key}><strong>{key}: </strong>{value}</p>
                    ))}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <pre style={styles.xmlContent}>{data.rawXML}</pre>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  xmlContent: {
    whiteSpace: 'pre-wrap',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px 0',
    overflow: 'auto',
    fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace'
  }
};


export default RSSReader;