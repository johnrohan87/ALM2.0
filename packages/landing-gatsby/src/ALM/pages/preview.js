import React, { useState, useCallback } from 'react';
import { Button, message, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useLazyFetchPreviewFeedQuery, useImportFeedMutation, useAddStoryToUserFeedMutation } from '../store/api';
import PreviewFeed from '../components/PreviewFeed';
import debounce from 'lodash.debounce';
import withAuth from '../utils/withAuth';
import NavigationBar from '../components/NavigationBar';

const PreviewPage = () => {
  const isAuthenticated = useSelector((state) => !!state.auth.token);

  const [triggerFetchPreviewFeed, { data: previewData, isFetching: isFetchingPreview }] = useLazyFetchPreviewFeedQuery();
  const [importFeed] = useImportFeedMutation();
  const [addStoryToUserFeed] = useAddStoryToUserFeedMutation();
  const [newFeedUrl, setNewFeedUrl] = useState('');

  const debouncedPreviewFeed = useCallback(
    debounce((value) => {
      triggerFetchPreviewFeed(value);
    }, 500),
    [triggerFetchPreviewFeed]
  );

  const handleImportFeed = async () => {
    if (!newFeedUrl) {
      message.warning('Please enter a valid feed URL');
      return;
    }

    try {
      await importFeed({ url: newFeedUrl }).unwrap();
      message.success('Feed imported successfully');
      setNewFeedUrl('');
    } catch (error) {
      const errorMessage = error?.data?.message || 'Failed to import feed';
      message.error(errorMessage);
    }
  };

  const handleAddStoryToUserFeed = useCallback(async (story, feed) => {
    try {
      await addStoryToUserFeed({ story, feed }).unwrap();
      message.success('Story added to your RSS feed successfully');
    } catch (error) {
      console.error('Error adding story to user feed:', error);
      message.error('Failed to add story to your RSS feed');
    }
  }, [addStoryToUserFeed]);  
  

  return (
    <div>
      <div style={{ padding: 24 }}>
        <h2>Add Feeds & Stories</h2>
        <PreviewFeed
          url={newFeedUrl}
          onPreviewFeed={(e) => {
            setNewFeedUrl(e.target.value);
            debouncedPreviewFeed(e.target.value);
          }}
          previewData={previewData}
          isFetchingPreview={isFetchingPreview}
          onAddStoryToUserFeed={(story) => handleAddStoryToUserFeed(story, previewData?.feed)}
        />

        <Button type="primary" onClick={handleImportFeed} disabled={!newFeedUrl}>
          Import Feed
        </Button>
      </div>
    </div>
  );
};

export default withAuth(PreviewPage);