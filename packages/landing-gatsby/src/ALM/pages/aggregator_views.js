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
  const { data: publicFeedData, refetch: refetchPublicFeed } = useFetchPublicFeedQuery(publicToken, {
    skip: !publicToken,
  });
  const { data: allFeedTokens, refetch: refetchAllFeedTokens, isLoading: isLoadingTokens } = useGetAllFeedTokensQuery(null, {
    skip: currentView !== 'publicFeed',
  });

  useEffect(() => {
    if (currentView === 'publicFeed') {
      refetchAllFeedTokens();
    }
  }, [currentView, refetchAllFeedTokens]);

  useEffect(() => {
    if (allFeedTokens && allFeedTokens.feeds && allFeedTokens.feeds.length > 0) {
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
          <Button onClick={() => setCurrentView('publicFeed')} style={{ marginRight: '10px' }}>View Public Feed</Button>
        </div>

        {isAuthenticated && (
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Enter Feed ID"
              value={selectedFeedId}
              onChange={(e) => setSelectedFeedId(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <Button
              type="primary"
              onClick={handleRequestToken}
              loading={isRequestingToken}
            >
              Generate Token
            </Button>
          </div>
        )}

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

        {publicToken && (
          <div>
            <h3>Public Token Generated</h3>
            <p>Token: {publicToken}</p>
            <Button onClick={refetchPublicFeed} style={{ marginTop: '10px' }}>Refresh Public Feed</Button>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <Button onClick={handleDeleteSelectedStories} style={{ marginRight: '10px' }} disabled={selectedStories.length === 0}>
            Delete Selected Stories
          </Button>
        </div>

        {currentView === 'publicFeed' && allFeedTokens && allFeedTokens.feeds && (
          <>
            <h3>Public Feed</h3>
            {isLoadingTokens ? (
              <Spin size="large" style={{ margin: '20px 0' }} />
            ) : (
              <div>
                {allFeedTokens.feeds.map((feed) => (
                  <div key={feed.feed_id} style={{ marginBottom: '20px' }}>
                    <p>Feed URL: {feed.feed_url}</p>
                    {feed.stories && feed.stories.length > 0 ? (
                      <ul>
                        {feed.stories.map((story) => (
                          <li key={story.id}>{story.title}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No stories available for this feed.</p>
                    )}
                  </div>
                ))}
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
  if (feedId && stories.length > 0) {
    return `Are you sure you want to delete this feed (Feed ID: ${feedId})?\n\nThis will also delete the following associated stories: ${stories.join(', ')}.\n\nThis action cannot be undone.`;
  } else if (feedId) {
    return `Are you sure you want to delete this feed (Feed ID: ${feedId})?\n\nThis action cannot be undone.`;
  } else if (stories.length > 0) {
    return `Are you sure you want to delete the following stor${stories.length > 1 ? 'ies' : 'y'}: ${stories.join(', ')}?\n\nThis action cannot be undone.`;
  }
  return '';
};

export default withAuth(AggregatorViews);