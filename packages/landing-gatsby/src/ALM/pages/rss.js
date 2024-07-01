import React, { useState, useEffect } from 'react';
import { useFetchUserFeedQuery, useImportFeedMutation, useEditStoryMutation } from '../store/api';
import { useAuth } from '../utils/authProvider';

const RSSPage = () => {
  const { token, isLoading: authLoading } = useAuth();
  const { data: userFeed, isLoading: isFetching, isError, error } = useFetchUserFeedQuery(undefined, {
    skip: !token  // Ensure the token is present before making the call
  });
  const [importFeed, { isLoading: isImporting, isSuccess: isImportSuccess, isError: isImportError }] = useImportFeedMutation();
  const [editStory, { isLoading: isEditing, isSuccess: isEditSuccess, isError: isEditError }] = useEditStoryMutation();
  const [newFeedUrl, setNewFeedUrl] = useState('');

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

  if (isFetching || isImporting || isEditing) return <div>Loading...</div>;
  if (isError) return <div>Error loading feeds: {error.message}</div>;
  if (isImportError || isEditError) {
    const message = isImportError ? 'Error importing feed.' : 'Error editing story.';
    return <div>{message}</div>;
  }

  return (
    <div>
      <h2>RSS Feeds</h2>
      <input
        type="text"
        value={newFeedUrl}
        onChange={(e) => setNewFeedUrl(e.target.value)}
        placeholder="Enter feed URL"
      />
      <button onClick={handleImportFeed} disabled={isImporting || !newFeedUrl.trim()}>
        Import New Feed
      </button>

      {userFeed?.feed?.map((story, idx) => (
        <div key={idx}>
          <h3>{story.title || 'No Title Available'}</h3>
          <p>{story.content || 'No Content Available'}</p>
          <button onClick={() => handleEditStory(idx, "New Title", "New Content")}>
            Edit Story
          </button>
        </div>
      ))}
    </div>
  );
};

export default RSSPage;