import React, { useState, useEffect, useCallback } from 'react';
import { Button, message, Spin } from 'antd';
import { useSelector } from 'react-redux';
import {
  useFetchUserFeedsQuery,
  useLazyFetchPreviewFeedQuery,
  useImportFeedMutation,
  useDeleteFeedMutation,
  useDeleteStoriesMutation,
} from '../store/api';
import FeedTable from '../components/FeedTable';
import PreviewFeed from '../components/PreviewFeed';
import DialogBox from '../components/DialogBox';
import debounce from 'lodash.debounce';

const RSSFeed = () => {
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const { data: feedsData, refetch: refetchFeeds, isLoading } = useFetchUserFeedsQuery(null, { skip: !isAuthenticated });

  const [triggerFetchPreviewFeed, { data: previewData, isFetching: isFetchingPreview }] = useLazyFetchPreviewFeedQuery();
  const [importFeed] = useImportFeedMutation();
  const [deleteFeed] = useDeleteFeedMutation();
  const [deleteStories] = useDeleteStoriesMutation();

  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ feedId: null, stories: [] });
  const [isDeleting, setIsDeleting] = useState(false);

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

  const showDeleteConfirmation = useCallback((feedId, storyIds) => {
    if (isModalVisible || isDeleting) {
      return;
    }
    console.log('Initial delete request for feed:', { feedId, stories: storyIds });
    console.log('Delete confirmation for feed:', feedId, 'with stories:', storyIds);
    setDeleteTarget({ feedId, stories: storyIds });
    setIsModalVisible(true);
  }, [isModalVisible, isDeleting]);

  const handleDeleteStory = useCallback((storyId) => {
    if (isModalVisible || isDeleting) {
      return;
    }
    console.log('Initial delete request for story:', { feedId: null, stories: [storyId] });
    console.log('Delete confirmation for story ID:', storyId);
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
        console.log('Deleting stories with payload:', { story_ids: stories });
        await deleteStories({ story_ids: stories }).unwrap();
        console.log('Stories deleted successfully');
        message.success(`Stories deleted successfully. Story IDs: ${stories.join(', ')}`);
      }

      if (feedId) {
        console.log('Deleting feed with payload:', { feed_id: feedId });
        await deleteFeed({ feed_id: feedId }).unwrap();
        console.log('Feed deleted successfully');
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
    <div style={{ padding: 24 }}>
      <h2>RSS Feeds</h2>

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
            console.log('onDeleteFeedsAndStories called with:', { feedId, storyIds });
            showDeleteConfirmation(feedId, storyIds);
          }}
          onShowDeleteConfirmation={showDeleteConfirmation}
          onDeleteStory={handleDeleteStory} // Pass the individual story delete handler
        />
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
  );
};

export default RSSFeed;