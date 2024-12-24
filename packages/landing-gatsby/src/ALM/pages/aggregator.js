import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import {
  useFetchUserFeedsQuery,
  useDeleteFeedMutation,
  useDeleteStoriesMutation,
  useSaveStoryMutation,
  useAddToUserFeedMutation,
} from '../store/api';
import withAuth from '../utils/withAuth';
import NavigationBar from '../components/NavigationBar';
import AggregatorViews from './aggregator_views';

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
  const [currentView, setCurrentView] = useState('userFeeds');
  const [selectedStories, setSelectedStories] = useState([]);

  useEffect(() => {
    if (currentView === 'userFeeds' && isAuthenticated) {
      refetchFeeds();
    }
  }, [currentView, isAuthenticated, refetchFeeds]);

  const handleDeleteStory = useCallback((storyId) => {
    setDeleteTarget({ feedId: null, stories: [storyId] });
    setIsModalVisible(true);
  }, []);

  const handleDeleteFeed = useCallback((feedId) => {
    setDeleteTarget({ feedId, stories: [] });
    setIsModalVisible(true);
  }, []);

  const showDeleteConfirmation = useCallback((feedId, storyIds) => {
    setDeleteTarget({ feedId, stories: storyIds });
    setIsModalVisible(true);
  }, []);

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

  const handleStoryCheckboxChange = (storyId, checked) => {
    setSelectedStories((prevSelectedStories) =>
      checked ? [...prevSelectedStories, storyId] : prevSelectedStories.filter((id) => id !== storyId)
    );
  };

  const handleDeleteSelectedStories = useCallback(async () => {
    if (selectedStories.length === 0) return;

    try {
      await deleteStories({ story_ids: selectedStories }).unwrap();
      message.success('Selected stories deleted successfully');
      setSelectedStories([]);
      refetchFeeds();
    } catch (error) {
      console.error('Error deleting selected stories:', error);
      message.error('Failed to delete selected stories');
    }
  }, [selectedStories, deleteStories, refetchFeeds]);

  return (
    <div>
      <NavigationBar />
      <AggregatorViews
        currentView={currentView}
        feeds={feeds}
        isLoading={isLoading}
        showDeleteConfirmation={showDeleteConfirmation}
        handleDeleteFeed={handleDeleteFeed}
        handleDeleteStory={handleDeleteStory}
        handleDeleteSelectedStories={handleDeleteSelectedStories}
        selectedStories={selectedStories}
        handleStoryCheckboxChange={handleStoryCheckboxChange}
        isModalVisible={isModalVisible}
        handleConfirmDelete={handleConfirmDelete}
        hideModal={hideModal}
        deleteTarget={deleteTarget}
        isDeleting={isDeleting}
        setCurrentView={setCurrentView}
      />
    </div>
  );
};

export default withAuth(AggregatorPage);