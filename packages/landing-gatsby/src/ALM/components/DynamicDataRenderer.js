import React from 'react';

const DynamicDataRenderer = ({ data }) => {
  // Helper function to render objects and arrays dynamically
  const renderContent = (item, key) => {
    if (Array.isArray(item)) {
      return (
        <div key={key}>
          <strong>{key}:</strong>
          <ul>
            {item.map((element, index) => (
              <li key={index}>
                {typeof element === 'object' ? renderContent(element, `Item ${index}`) : String(element)}
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (typeof item === 'object' && item !== null) {
      return (
        <div key={key}>
          <strong>{key}:</strong>
          <div style={{ marginLeft: '20px' }}>
            {Object.entries(item).map(([subKey, subValue]) => renderContent(subValue, subKey))}
          </div>
        </div>
      );
    } else {
      return (
        <div key={key}>
          <strong>{key}:</strong> {String(item)}
        </div>
      );
    }
  };

  if (!data || typeof data !== 'object') {
    return <p>No data available</p>;
  }

  return <div>{Object.entries(data).map(([key, value]) => renderContent(value, key))}</div>;
};

export default DynamicDataRenderer;
