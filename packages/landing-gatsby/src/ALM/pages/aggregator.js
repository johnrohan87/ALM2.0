import React, { useState, useEffect, useCallback } from 'react';
import { Button, message, Spin } from 'antd';
import { useSelector } from 'react-redux';
import {
  useFetchUserFeedsQuery,
  useLazyFetchPreviewFeedQuery,
  useImportFeedMutation,
  useDeleteFeedMutation,
  useDeleteStoriesMutation,
  useSaveStoryMutation,
  useAddToUserFeedMutation,
  useAddStoryToUserFeedMutation,
} from '../store/api';
import FeedTable from '../components/FeedTable';
import PreviewFeed from '../components/PreviewFeed';
import DialogBox from '../components/DialogBox';
import SavedStoriesView from '../components/SavedStoriesView';
import debounce from 'lodash.debounce';
import withAuth from '../utils/withAuth';
import NavigationBar from '../components/NavigationBar';

const AggregatorPage = () => {
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const { data: feedsData, refetch: refetchFeeds, isLoading } = useFetchUserFeedsQuery(null, { skip: !isAuthenticated });

  const [triggerFetchPreviewFeed, { data: previewData, isFetching: isFetchingPreview }] = useLazyFetchPreviewFeedQuery();
  const [importFeed] = useImportFeedMutation();
  const [deleteFeed] = useDeleteFeedMutation();
  const [deleteStories] = useDeleteStoriesMutation();
  const [saveStory] = useSaveStoryMutation();
  const [addToUserFeed] = useAddToUserFeedMutation();
  const [addStoryToUserFeed] = useAddStoryToUserFeedMutation();

  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ feedId: null, stories: [] });
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentView, setCurrentView] = useState('allFeeds');

  useEffect(() => {
    console.log('Feeds data:', feedsData);
  }, [feedsData]);

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
      refetchFeeds();
    } catch (error) {
      const errorMessage = error?.data?.message || 'Failed to import feed';
      message.error(errorMessage);
    }
  };

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

  const handleAddStoryToUserFeed = useCallback(async (storyId) => {
    try {
      await addStoryToUserFeed({ story_id: storyId }).unwrap();
      message.success('Story added to your RSS feed successfully');
    } catch (error) {
      console.error('Error adding story to user feed:', error);
      message.error('Failed to add story to your RSS feed');
    }
  }, [addStoryToUserFeed]);

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
          <Button onClick={() => setCurrentView('savedStories')} style={{ marginRight: '10px' }}>Saved Stories</Button>
          <Button onClick={() => setCurrentView('myFeeds')} style={{ marginRight: '10px' }}>My RSS Feeds</Button>
        </div>

        {currentView === 'allFeeds' && (
          <>
            <h3>All Feeds & Stories</h3>
            <PreviewFeed
              url={newFeedUrl}
              onPreviewFeed={(e) => {
                setNewFeedUrl(e.target.value);
                debouncedPreviewFeed(e.target.value);
              }}
              previewData={previewData}
              isFetchingPreview={isFetchingPreview}
            />

            <Button type="primary" onClick={handleImportFeed} disabled={!newFeedUrl}>
              Import Feed
            </Button>

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
                onAddStoryToUserFeed={handleAddStoryToUserFeed}
              />
            )}
          </>
        )}

        {currentView === 'savedStories' && (
          <SavedStoriesView />
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