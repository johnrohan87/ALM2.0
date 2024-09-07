import React, { useState, useEffect } from 'react';
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

const RSSFeed = () => {
  const token = useSelector((state) => state.auth.token);
  const { data: feedsData, refetch: refetchFeeds, isLoading } = useFetchUserFeedsQuery(null, { skip: !token });

  const [triggerFetchPreviewFeed, { data: previewData, isFetching: isFetchingPreview }] = useLazyFetchPreviewFeedQuery();
  const [importFeed] = useImportFeedMutation();
  const [deleteFeed] = useDeleteFeedMutation();
  const [deleteStories] = useDeleteStoriesMutation();

  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [expandedFeeds, setExpandedFeeds] = useState({});
  const [selectedFeeds, setSelectedFeeds] = useState([]);
  const [selectedStories, setSelectedStories] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ feedId: null, stories: [] });

  useEffect(() => {
    console.log('Feeds data:', feedsData);
  }, [feedsData]);

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
      message.error('Failed to import feed');
    }
  };

  const showDeleteConfirmation = (feedId) => {
    const selectedFeedStories = selectedStories[feedId] || [];
    setDeleteTarget({ feedId, stories: selectedFeedStories });
    setIsModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    const { feedId, stories } = deleteTarget;

    try {
      if (stories.length > 0) {
        await deleteStories(stories).unwrap();
        setSelectedStories((prev) => ({ ...prev, [feedId]: [] }));
        message.success('Stories deleted successfully');
        refetchFeeds();
      } else {
        await deleteFeed(feedId).unwrap();
        setSelectedFeeds((prev) => prev.filter((id) => id !== feedId));
        refetchFeeds();
        message.success('Feed deleted successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to delete feed or stories');
    }
  };

  const handleFeedSelect = (selectedRowKeys) => {
    setSelectedFeeds(selectedRowKeys);
  };

  const handleStorySelect = (storyId, feedId) => {
    setSelectedStories((prevSelected) => {
      const currentSelectedStories = prevSelected[feedId] || [];
      const newSelectedStories = currentSelectedStories.includes(storyId)
        ? currentSelectedStories.filter((id) => id !== storyId)
        : [...currentSelectedStories, storyId];
      return { ...prevSelected, [feedId]: newSelectedStories };
    });
  };

  const toggleFeedExpansion = (feedId, expanded) => {
    setExpandedFeeds((prev) => ({ ...prev, [feedId]: expanded }));
  };

  const feeds = feedsData?.feeds || [];

  return (
    <div style={{ padding: 24 }}>
      <h2>RSS Feeds</h2>

      <PreviewFeed
        url={newFeedUrl}
        onPreviewFeed={(e) => setNewFeedUrl(e.target.value)}
        previewData={previewData}
        isFetchingPreview={isFetchingPreview}
      />

      <Button type="primary" onClick={handleImportFeed} disabled={!newFeedUrl}>
        Import Feed
      </Button>

      {isLoading ? (
        <Spin size="large" style={{ margin: '20px 0' }} />
      ) : (
        <FeedTable feeds={feeds} />
      )}

      <DialogBox
        isVisible={isModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalVisible(false)}
        deleteTarget={deleteTarget}
      />
    </div>
  );
};

export default RSSFeed;