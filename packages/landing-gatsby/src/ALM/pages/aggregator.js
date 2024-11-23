import React, { useState, useEffect, useCallback } from 'react';
import { Button, message, Spin } from 'antd';
import { useSelector } from 'react-redux';
import {
  useFetchUserFeedsQuery,
  useDeleteFeedMutation,
  useDeleteStoriesMutation,
  useSaveStoryMutation,
  useAddToUserFeedMutation,
} from '../store/api';
import FeedTable from '../components/FeedTable';
import Preview from './preview';
import DialogBox from '../components/DialogBox';
import debounce from 'lodash.debounce';
import withAuth from '../utils/withAuth';
import NavigationBar from '../components/NavigationBar';

const AggregatorPage = () => {
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const { data: feedsData, refetch: refetchFeeds, isLoading } = useFetchUserFeedsQuery(null, { skip: !isAuthenticated });

  const [deleteFeed] = useDeleteFeedMutation();
  const [deleteStories] = useDeleteStoriesMutation();
  const [saveStory] = useSaveStoryMutation();
  const [addToUserFeed] = useAddToUserFeedMutation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ feedId: null, stories: [] });
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentView, setCurrentView] = useState('allFeeds');
  const [selectedFeeds, setSelectedFeeds] = useState([]);
  const [selectedStories, setSelectedStories] = useState([]);

  useEffect(() => {
    if (currentView === 'allFeeds' && isAuthenticated) {
      refetchFeeds();
    }
  }, [currentView, isAuthenticated, refetchFeeds]);

  const handleSaveStory = useCallback(async (storyId) => {
    try {
      await saveStory({ story_id: storyId }).unwrap();
      message.success('Story saved successfully');
    } catch (error) {
      console.error('Error saving story:', error);
      message.error('Failed to save story');
    }
  }, [saveStory]);

  const handleAddToUserFeed = useCallback(async (feedId) => {
    try {
      await addToUserFeed({ feed_id: feedId }).unwrap();
      message.success('Feed added to your RSS feed successfully');
    } catch (error) {
      console.error('Error adding feed to user feed:', error);
      message.error('Failed to add feed to your RSS feed');
    }
  }, [addToUserFeed]);

  const showDeleteConfirmation = useCallback((feedId, storyIds) => {
    if (isModalVisible || isDeleting) {
      return;
    }
    setDeleteTarget({ feedId, stories: storyIds });
    setIsModalVisible(true);
  }, [isModalVisible, isDeleting]);

  const handleDeleteStory = useCallback((storyId) => {
    if (isModalVisible || isDeleting) {
      return;
    }
    setDeleteTarget({ feedId: null, stories: [storyId] });
    setIsModalVisible(true);
  }, [isModalVisible, isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (isDeleting) {
      return;
    }
    setIsDeleting(true);

    const { feedId, stories } = deleteTarget;

    try {
      if (stories.length > 0) {
        await deleteStories({ story_ids: stories }).unwrap();
        message.success(`Stories deleted successfully. Story IDs: ${stories.join(', ')}`);
      }

      if (feedId) {
        await deleteFeed({ feed_id: feedId }).unwrap();
        message.success(`Feed deleted successfully. Feed ID: ${feedId}`);
      }

      refetchFeeds();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Failed to delete feed or stories');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, deleteStories, deleteFeed, refetchFeeds, isDeleting]);

  const hideModal = () => setIsModalVisible(false);

  const feeds = feedsData?.feeds || [];

  const handleFeedCheckboxChange = (feedId, checked) => {
    setSelectedFeeds((prevSelectedFeeds) =>
      checked ? [...prevSelectedFeeds, feedId] : prevSelectedFeeds.filter((id) => id !== feedId)
    );
  };
  
  const handleStoryCheckboxChange = (storyId, checked) => {
    setSelectedStories((prevSelectedStories) =>
      checked ? [...prevSelectedStories, storyId] : prevSelectedStories.filter((id) => id !== storyId)
    );
  };
  
  const handleSaveSelectedStories = useCallback(async () => {
    try {
      await Promise.all(selectedStories.map((storyId) => saveStory({ story_id: storyId }).unwrap()));
      message.success('Selected stories saved successfully');
      setSelectedStories([]);
    } catch (error) {
      console.error('Error saving selected stories:', error);
      message.error('Failed to save selected stories');
    }
  }, [selectedStories, saveStory]);
  
  const handleAddSelectedFeedsToUserFeed = useCallback(async () => {
    try {
      await Promise.all(selectedFeeds.map((feedId) => addToUserFeed({ feed_id: feedId }).unwrap()));
      message.success('Selected feeds added to your RSS feed successfully');
      setSelectedFeeds([]);
    } catch (error) {
      console.error('Error adding selected feeds to user feed:', error);
      message.error('Failed to add selected feeds to your RSS feed');
    }
  }, [selectedFeeds, addToUserFeed]);  

  const getDeleteConfirmationMessage = () => {
    const { feedId, stories } = deleteTarget;
    if (feedId && stories.length > 0) {
      return `Are you sure you want to delete this feed (Feed ID: ${feedId})?

This will also delete the following associated stories: ${stories.join(', ')}.

This action cannot be undone.`;
    } else if (feedId) {
      return `Are you sure you want to delete this feed (Feed ID: ${feedId})?

This action cannot be undone.`;
    } else if (stories.length > 0) {
      return `Are you sure you want to delete the following stor${stories.length > 1 ? 'ies' : 'y'}: ${stories.join(', ')}?

This action cannot be undone.`;
    }
    return '';
  };

  return (
    <div>
      <NavigationBar />
      <div style={{ padding: 24 }}>
        <h2>RSS Feeds Aggregator</h2>

        <div style={{ marginBottom: '20px' }}>
          <Button onClick={() => setCurrentView('allFeeds')} style={{ marginRight: '10px' }}>All Feeds</Button>
          <Button onClick={() => setCurrentView('previewFeed')} style={{ marginRight: '10px' }}>Add Feeds & Stories</Button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Button onClick={handleSaveSelectedStories} style={{ marginRight: '10px' }} disabled={selectedStories.length === 0}>
            Save Selected Stories
          </Button>
          <Button onClick={handleAddSelectedFeedsToUserFeed} style={{ marginRight: '10px' }} disabled={selectedFeeds.length === 0}>
            Add Selected Feeds to My RSS Feed
          </Button>
        </div>

        {currentView === 'allFeeds' && (
          <>
            <h3>All Feeds & Stories</h3>
            {isLoading ? (
              <Spin size="large" style={{ margin: '20px 0' }} />
            ) : (
              <FeedTable
                feeds={feeds}
                onDeleteFeedsAndStories={(feedId, storyIds) => {
                  showDeleteConfirmation(feedId, storyIds);
                }}
                onShowDeleteConfirmation={showDeleteConfirmation}
                onDeleteStory={handleDeleteStory}
                onSaveStory={handleSaveStory}
                onAddToUserFeed={handleAddToUserFeed}
                onFeedCheckboxChange={handleFeedCheckboxChange}
                onStoryCheckboxChange={handleStoryCheckboxChange}
              />
            )}
          </>
        )}

        {currentView === 'previewFeed' && (
          <Preview />
        )}

        <DialogBox
          isVisible={isModalVisible}
          onConfirm={handleConfirmDelete}
          onCancel={hideModal}
          deleteTarget={deleteTarget}
          isLoading={isDeleting}
          message={getDeleteConfirmationMessage()}
        />
      </div>
    </div>
  );
}

export default withAuth(AggregatorPage);