import React, { useState, useEffect } from 'react';
import { useFetchUserFeedQuery, useImportFeedMutation, useEditStoryMutation } from '../store/api';
import { useAuth } from '../utils/authProvider';
import withAuth from "../utils/withAuth";

const RSSPage = () => {
  const { token, isLoading: authLoading } = useAuth();
  const { data: userFeed, isLoading: isFetching, isError, error } = useFetchUserFeedQuery(undefined, {
    skip: !token
  });
  const [importFeed, { isLoading: isImporting, isSuccess: isImportSuccess, isError: isImportError }] = useImportFeedMutation();
  const [editStory, { isLoading: isEditing, isSuccess: isEditSuccess, isError: isEditError }] = useEditStoryMutation();
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [selectedStories, setSelectedStories] = useState([]);

  useEffect(() => {
    if (!authLoading && !token) {
      console.log('rss - !authLoading && !token');
    }
    if (userFeed) {
      console.log('User Feed:', userFeed);
    }
  }, [authLoading, token, userFeed]);

  const handleImportFeed = async () => {
    if (newFeedUrl.trim()) {
      try {
        await importFeed({ url: newFeedUrl }).unwrap();
        setNewFeedUrl('');
        alert('Feed imported successfully!');
      } catch (err) {
        console.error('Failed to import feed:', err);
        alert('Failed to import feed. Please check the console for more details.');
      }
    }
  };

  const handleEditStory = async (storyId, customTitle, customContent) => {
    try {
      await editStory({ storyId, storyData: { custom_title: customTitle, custom_content: customContent } }).unwrap();
      alert('Story updated successfully!');
    } catch (err) {
      console.error('Failed to edit story:', err);
      alert('Failed to edit story. Please check the console for more details.');
    }
  };

  const handleSelectStory = (story) => {
    setSelectedStories((prevSelected) =>
      prevSelected.includes(story)
        ? prevSelected.filter((s) => s !== story)
        : [...prevSelected, story]
    );
  };

  const handleSelectAll = () => {
    if (selectedStories.length === userFeed.feed.length) {
      setSelectedStories([]);
    } else {
      setSelectedStories(userFeed.feed);
    }
  };

  const handleShareSelected = () => {
    alert(`Sharing ${selectedStories.length} stories: \n${selectedStories.map(story => story.title).join('\n')}`);
  };

  if (isFetching || isImporting || isEditing) return <div>Loading...</div>;
  if (isError) return <div>Error loading feeds: {error.message}</div>;
  if (isImportError || isEditError) {
    const message = isImportError ? 'Error importing feed.' : 'Error editing story.';
    return <div>{message}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>RSS Feeds</h2>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          value={newFeedUrl}
          onChange={(e) => setNewFeedUrl(e.target.value)}
          placeholder="Enter feed URL"
        />
        <button
          style={styles.button}
          onClick={handleImportFeed}
          disabled={isImporting || !newFeedUrl.trim()}
        >
          Import New Feed
        </button>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={selectedStories.length === userFeed?.feed?.length}
            onChange={handleSelectAll}
          />
          Select All
        </label>
      </div>
      {userFeed?.feed?.map((story, idx) => (
        <div key={idx} style={styles.storyContainer}>
          <label>
            <input
              type="checkbox"
              checked={selectedStories.includes(story)}
              onChange={() => handleSelectStory(story)}
            />
            <h3 style={styles.storyTitle}>{story.title || 'No Title Available'}</h3>
          </label>
          <p style={styles.storyContent}>{story.content || 'No Content Available'}</p>
          <button
            style={styles.button}
            onClick={() => handleEditStory(idx, "New Title", "New Content")}
          >
            Edit Story
          </button>
        </div>
      ))}
      {selectedStories.length > 0 && (
        <button style={styles.button} onClick={handleShareSelected}>
          Share Selected Stories
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  input: {
    flex: '1',
    padding: '10px',
    marginRight: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  storyContainer: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9',
  },
  storyTitle: {
    marginBottom: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  storyContent: {
    marginBottom: '10px',
    fontSize: '14px',
  },
};

export default withAuth(RSSPage);