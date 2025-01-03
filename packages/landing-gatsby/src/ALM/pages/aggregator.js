import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { message, Button, Spin } from 'antd';
import {
  useFetchUserFeedsQuery,
  useDeleteFeedMutation,
  useDeleteStoriesMutation,
} from '../store/api';
import NavigationBar from '../components/NavigationBar';
import FeedPreviewer from '../components/FeedPreviewer';
import FeedTable from '../components/FeedTable';
import DialogBox from '../components/DialogBox';
import withAuth from '../utils/withAuth';

const AggregatorPage = ({data}) => {
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const { data: feedsData, refetch: refreshFeeds, isLoading: isLoadingFeeds } = useFetchUserFeedsQuery(null, {
    skip: !isAuthenticated,
  });

  const [localFeeds, setLocalFeeds] = useState([]);
  const [deleteFeed] = useDeleteFeedMutation();
  const [deleteStories] = useDeleteStoriesMutation();
  const [selectedStories, setSelectedStories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ feedId: null, storyIds: [] });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    refreshFeeds().then(({ data }) => {
      console.log("Refreshed feeds from backend:", data?.feeds);
      setLocalFeeds(data?.feeds || []);
    });
  }, [refreshFeeds]);

  const handleDelete = useCallback(async (feedId) => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      await deleteFeed({ feed_id: feedId }).unwrap();
      message.success(`Feed deleted successfully. Feed ID: ${feedId}`);

      setLocalFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.id !== feedId));
      await refreshFeeds();
    } catch (error) {
      console.error("Error during deletion:", error);
      message.error("Failed to delete feed.");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteFeed, refreshFeeds, isDeleting]);

  const handleRefreshFeeds = async () => {
    try {
      const updatedFeeds = await refreshFeeds();
      console.log('Updating local data with -', updatedFeeds.data?.feeds)
      setLocalFeeds(updatedFeeds.data?.feeds || []);
    } catch (error) {
      console.error("Error refreshing feeds:", error);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div style={{ padding: 24 }}>
        <h2>Aggregator Page</h2>
        <FeedPreviewer onFeedAdded={(newFeed) => setLocalFeeds((feeds) => [...feeds, newFeed])} refreshFeeds={refreshFeeds} />
        {isLoadingFeeds ? (
          <Spin size="large" style={{ margin: '20px 0' }} />
        ) : (
          <FeedTable
            feeds={localFeeds}
            selectedStories={selectedStories}
            onDelete={(feedId) => handleDelete(feedId)}
            onRefreshFeeds={handleRefreshFeeds}
          />
        )}
        <DialogBox
          isVisible={isModalVisible}
          onConfirm={() => handleDelete(deleteTarget.feedId, deleteTarget.storyIds)}
          onCancel={() => setIsModalVisible(false)}
          deleteTarget={deleteTarget}
          isLoading={isDeleting}
          message="Are you sure you want to delete this feed?"
        />
      </div>
    </div>
  );
};

export default withAuth(AggregatorPage);