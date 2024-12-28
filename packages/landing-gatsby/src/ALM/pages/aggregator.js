import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import {
  useFetchUserFeedsQuery,
  useDeleteFeedMutation,
} from '../store/api';
import withAuth from '../utils/withAuth';
import NavigationBar from '../components/NavigationBar';
import AggregatorViews from './aggregator_views';

const AggregatorPage = () => {
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const { data: feedsData, refetch: refetchFeeds, isLoading } = useFetchUserFeedsQuery(null, { skip: !isAuthenticated });

  const [deleteFeed] = useDeleteFeedMutation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ feedId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentView, setCurrentView] = useState('userFeeds');

  useEffect(() => {
    if (currentView === 'userFeeds' && isAuthenticated) {
      refetchFeeds();
    }
  }, [currentView, isAuthenticated, refetchFeeds]);

  const handleDeleteFeed = useCallback((feedId) => {
    setDeleteTarget({ feedId });
    setIsModalVisible(true);
  }, []);

  const showDeleteConfirmation = useCallback((feedId) => {
    setDeleteTarget({ feedId });
    setIsModalVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (isDeleting) {
      return;
    }
    setIsDeleting(true);

    const { feedId } = deleteTarget;

    try {
      if (feedId) {
        await deleteFeed({ feed_id: feedId }).unwrap();
        message.success(`Feed deleted successfully. Feed ID: ${feedId}`);
      }

      refetchFeeds();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Failed to delete feed');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, deleteFeed, refetchFeeds, isDeleting]);

  const hideModal = () => setIsModalVisible(false);

  const feeds = feedsData?.feeds || [];

  return (
    <div>
      <NavigationBar />
      <AggregatorViews
        currentView={currentView}
        feeds={feeds}
        isLoading={isLoading}
        showDeleteConfirmation={showDeleteConfirmation}
        handleDeleteFeed={handleDeleteFeed}
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