import React, { useState, useCallback, useEffect } from 'react';
import { Button, message, Spin } from 'antd';
import { useSelector } from 'react-redux';
import {
  useRequestUserTokenMutation,
  useFetchPublicFeedQuery,
  useFetchUserFeedsQuery,
  useLazyFetchPreviewFeedQuery,
  useImportFeedMutation,
  useGetAllFeedTokensQuery,
} from '../store/api';
import FeedTable from '../components/FeedTable';
import DynamicDataRenderer from '../components/DynamicDataRenderer';
import Preview from './preview';
import DialogBox from '../components/DialogBox';
import debounce from 'lodash.debounce';
import withAuth from '../utils/withAuth';

const AggregatorViews = ({
  currentView,
  feeds,
  isLoading,
  handleDeleteFeed,
  handleDeleteStory,
  handleDeleteSelectedStories,
  selectedStories,
  handleStoryCheckboxChange,
  isModalVisible,
  handleConfirmDelete,
  showDeleteConfirmation,
  hideModal,
  deleteTarget,
  isDeleting,
  setCurrentView,
}) => {
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const { data: feedsData, refetch: refetchFeeds, isLoading: isLoadingFeeds } = useFetchUserFeedsQuery(null, { skip: !isAuthenticated });

  const [triggerFetchPreviewFeed, { data: previewData, isFetching: isFetchingPreview }] = useLazyFetchPreviewFeedQuery();
  const [importFeed] = useImportFeedMutation();
  const [selectedFeedId, setSelectedFeedId] = useState('');
  const [publicToken, setPublicToken] = useState(null);

  const [requestUserToken, { isLoading: isRequestingToken }] = useRequestUserTokenMutation();
  const { data: publicFeedData, refetch: refetchPublicFeed, isLoading: isLoadingPublicFeed } = useFetchPublicFeedQuery(publicToken, {
    skip: !publicToken,
  });
  const { data: allFeedTokens, refetch: refetchAllFeedTokens, isLoading: isLoadingTokens } = useGetAllFeedTokensQuery(null, {
    skip: currentView !== 'publicTokensAccess',
  });

  // Fetch all tokens when "Public Tokens and Access" is selected
  useEffect(() => {
    if (currentView === 'publicTokensAccess') {
      refetchAllFeedTokens();
    }
  }, [currentView, refetchAllFeedTokens]);

  // Set default token if tokens are fetched
  useEffect(() => {
    if (allFeedTokens?.feeds?.length > 0) {
      setPublicToken(allFeedTokens.feeds[0].public_token);
    }
  }, [allFeedTokens]);

  const debouncedPreviewFeed = useCallback(
    debounce((value) => {
      triggerFetchPreviewFeed(value);
    }, 500),
    [triggerFetchPreviewFeed]
  );

  const handleRequestToken = useCallback(async () => {
    if (!selectedFeedId) {
      message.warning('Please select a feed to generate a token');
      return;
    }

    try {
      const response = await requestUserToken({ feed_id: selectedFeedId }).unwrap();
      message.success('Token generated successfully');
      setPublicToken(response.token);
    } catch (error) {
      console.error('Error generating token:', error);
      message.error('Failed to generate token');
    }
  }, [selectedFeedId, requestUserToken]);

  const handleImportFeed = async (newFeedUrl) => {
    if (!newFeedUrl) {
      message.warning('Please enter a valid feed URL');
      return;
    }

    try {
      await importFeed({ url: newFeedUrl }).unwrap();
      message.success('Feed imported successfully');
      refetchFeeds();
    } catch (error) {
      const errorMessage = error?.data?.message || 'Failed to import feed';
      message.error(errorMessage);
    }
  };

  return (
    <div>
      <div style={{ padding: 24 }}>
        <h2>RSS Feeds Aggregator</h2>
        <div style={{ marginBottom: '20px' }}>
          <Button onClick={() => setCurrentView('userFeeds')} style={{ marginRight: '10px' }}>User Feeds</Button>
          <Button onClick={() => setCurrentView('previewFeed')} style={{ marginRight: '10px' }}>Add Feeds & Stories</Button>
          <Button onClick={() => setCurrentView('publicTokensAccess')} style={{ marginRight: '10px' }}>Public Tokens and Access</Button>
          <Button onClick={() => setCurrentView('publicFeed')} style={{ marginRight: '10px' }}>View Public Feed</Button>
        </div>

        {currentView === 'userFeeds' && (
          <>
            <h3>User Feeds & Stories</h3>
            {isLoadingFeeds ? (
              <Spin size="large" style={{ margin: '20px 0' }} />
            ) : (
              <FeedTable
                feeds={feeds || []}
                onDeleteFeedsAndStories={showDeleteConfirmation}
                onDeleteStory={handleDeleteStory}
                onStoryCheckboxChange={handleStoryCheckboxChange}
              />
            )}
          </>
        )}

        {currentView === 'previewFeed' && (
          <Preview
            onPreviewFeed={(e) => {
              debouncedPreviewFeed(e.target.value);
            }}
            previewData={previewData}
            isFetchingPreview={isFetchingPreview}
            onImportFeed={handleImportFeed}
          />
        )}

        {currentView === 'publicTokensAccess' && allFeedTokens && allFeedTokens.feeds && (
          <>
            <h3>Public Tokens and Access</h3>
            {isLoadingTokens ? (
              <Spin size="large" style={{ margin: '20px 0' }} />
            ) : (
              <div>
                {allFeedTokens.feeds.map((feed) => (
                  <div key={feed.feed_id} style={{ marginBottom: '20px' }}>
                    <p>Feed ID: {feed.feed_id} URL: {feed.feed_url}</p>
                    <p>Public Token: {feed.public_token}</p>
                    <p>Public URL: {feed.public_url}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {currentView === 'publicFeed' && publicFeedData && (
          <>
            <h3>Public Feed</h3>
            {isLoadingPublicFeed ? (
              <Spin size="large" style={{ margin: '20px 0' }} />
            ) : (
              <div>
                <p>Feed ID: {publicFeedData.id}</p>
                <p>Feed URL: {publicFeedData.url}</p>
                <p>Associated USER: {publicFeedData.user_id}</p>
                {publicFeedData.stories?.length > 0 ? (
                  publicFeedData.stories.map((story) => (
                    <div key={story.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                      <DynamicDataRenderer data={story} />
                    </div>
                  ))
                ) : (
                  <p>No stories available for this feed.</p>
                )}
              </div>
            )}
          </>
        )}

        <DialogBox
          isVisible={isModalVisible}
          onConfirm={handleConfirmDelete}
          onCancel={hideModal}
          deleteTarget={deleteTarget}
          isLoading={isDeleting}
          message={getDeleteConfirmationMessage(deleteTarget)}
        />
      </div>
    </div>
  );
};

const getDeleteConfirmationMessage = (deleteTarget) => {
  if (!deleteTarget) return '';
  const { feedId, stories } = deleteTarget;
  if (feedId && stories?.length > 0) {
    return `Are you sure you want to delete this feed (Feed ID: ${feedId})?\n\nThis will also delete the following associated stories: ${stories.join(', ')}.\n\nThis action cannot be undone.`;
  } else if (feedId) {
    return `Are you sure you want to delete this feed (Feed ID: ${feedId})?\n\nThis action cannot be undone.`;
  } else if (stories?.length > 0) {
    return `Are you sure you want to delete the following stor${stories.length > 1 ? 'ies' : 'y'}: ${stories.join(', ')}?\n\nThis action cannot be undone.`;
  }
  return '';
};

export default withAuth(AggregatorViews);