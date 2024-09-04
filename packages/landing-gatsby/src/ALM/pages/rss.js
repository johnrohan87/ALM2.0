import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  useFetchUserFeedsQuery,
  useLazyFetchUserStoriesQuery,
  useLazyFetchPreviewFeedQuery,
  useImportFeedMutation,
  useDeleteStoriesMutation,
  useDeleteFeedMutation,
} from '../store/api';
import { styles } from './styles/rss.styles';

// Debounce function to delay execution of the callback
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Function to validate the URL format
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

const RSSFeed = () => {
  const token = useSelector((state) => state.auth.token);
  const { data: feedsData, isLoading: isLoadingFeeds, refetch: refetchFeeds } = useFetchUserFeedsQuery(null, {
    skip: !token,
  });

  const feeds = feedsData?.feeds || [];
  const [expandedFeeds, setExpandedFeeds] = useState({});
  const [expandedStories, setExpandedStories] = useState({});
  const [selectedFeeds, setSelectedFeeds] = useState([]);
  const [selectedStories, setSelectedStories] = useState([]);
  const [fetchedStories, setFetchedStories] = useState({});
  const [previewFeed, setPreviewFeed] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [triggerFetchStories, { isFetching }] = useLazyFetchUserStoriesQuery();
  const [triggerFetchPreviewFeed, { data: previewData, isFetching: isFetchingPreview }] = useLazyFetchPreviewFeedQuery();
  const [importFeed] = useImportFeedMutation();
  const [deleteFeed] = useDeleteFeedMutation();
  const [deleteStories] = useDeleteStoriesMutation();

  const [newFeedUrl, setNewFeedUrl] = useState('');

  useEffect(() => {
    if (previewData) {
      setPreviewFeed(previewData);
    }
  }, [previewData]);

  // Debounced function to preview the feed
  const handlePreviewFeed = debounce(async () => {
    if (isValidUrl(newFeedUrl)) {
      setShowPreview(true);
      try {
        await triggerFetchPreviewFeed(newFeedUrl);
      } catch (error) {
        console.error('Failed to fetch preview:', error);
        setPreviewFeed(null);
      }
    } else {
      console.error('Invalid URL');
      setShowPreview(false);
      setPreviewFeed(null);
    }
  }, 500);

  const handleImportFeed = async () => {
    if (isValidUrl(newFeedUrl)) {
      try {
        await importFeed({ url: newFeedUrl }).unwrap();
        setNewFeedUrl('');
        refetchFeeds();
      } catch (error) {
        console.error('Failed to import feed:', error);
      }
    } else {
      console.error('Invalid URL');
    }
  };

  // Function to toggle the expansion of feeds
  const toggleFeedExpansion = (feedId) => {
    setExpandedFeeds((prev) => ({
      ...prev,
      [feedId]: !prev[feedId],
    }));

    if (!expandedFeeds[feedId] && !fetchedStories[feedId]) {
      triggerFetchStories({ feedId }).unwrap().then((result) => {
        setFetchedStories((prev) => ({ ...prev, [feedId]: result.stories }));
      });
    }
  };

  // Function to handle feed selection
  const handleFeedSelect = (feedId) => {
    if (selectedFeeds.includes(feedId)) {
      setSelectedFeeds((prev) => prev.filter((id) => id !== feedId));
      setSelectedStories((prevSelected) =>
        prevSelected.filter((storyId) => !fetchedStories[feedId]?.map((s) => s.id).includes(storyId))
      );
    } else {
      setSelectedFeeds((prev) => [...prev, feedId]);
      if (fetchedStories[feedId]) {
        setSelectedStories((prevSelected) => [
          ...prevSelected,
          ...fetchedStories[feedId].map((story) => story.id),
        ]);
      }
    }
  };

  // Function to delete feed and its stories
  const handleDeleteFeedAndStories = async (feedId) => {
    try {
      if (selectedFeeds.includes(feedId)) {
        await deleteFeed(feedId).unwrap();
        setSelectedFeeds((prev) => prev.filter((id) => id !== feedId));
        setExpandedFeeds((prev) => ({ ...prev, [feedId]: false }));
        refetchFeeds();
      } else if (selectedStories.length > 0) {
        const storiesToDelete = fetchedStories[feedId].filter((story) =>
          selectedStories.includes(story.id)
        ).map((story) => story.id);

        if (storiesToDelete.length > 0) {
          await deleteStories(storiesToDelete).unwrap();
          setSelectedStories((prev) => prev.filter((id) => !storiesToDelete.includes(id)));
          const updatedStories = await triggerFetchStories({ feedId }).unwrap();
          setFetchedStories((prev) => ({
            ...prev,
            [feedId]: updatedStories.stories,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to delete feed or stories:', error);
    }
  };

  // Function to toggle story expansion
  const toggleStoryExpansion = (storyId) => {
    setExpandedStories((prev) => ({
      ...prev,
      [storyId]: !prev[storyId],
    }));
  };

  // Function to handle story selection
  const handleStorySelect = (storyId, feedId) => {
    const newSelectedStories = selectedStories.includes(storyId)
      ? selectedStories.filter((id) => id !== storyId)
      : [...selectedStories, storyId];

    setSelectedStories(newSelectedStories);

    // Deselect the feed if any child story is deselected
    const feedStories = fetchedStories[feedId]?.map((story) => story.id) || [];
    const areAllSelected = feedStories.every((id) => newSelectedStories.includes(id));

    if (!areAllSelected && selectedFeeds.includes(feedId)) {
      setSelectedFeeds((prevSelected) => prevSelected.filter((id) => id !== feedId));
    } else if (areAllSelected && !selectedFeeds.includes(feedId)) {
      setSelectedFeeds((prevSelected) => [...prevSelected, feedId]);
    }
  };

  if (isLoadingFeeds) return <div>Loading Feeds...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>RSS Feeds</h2>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          value={newFeedUrl}
          onChange={(e) => setNewFeedUrl(e.target.value)}
          placeholder="Enter feed URL"
          onBlur={handlePreviewFeed}  // Trigger preview when the user finishes typing
        />
        <button
          style={styles.button}
          onClick={handleImportFeed}
          disabled={isLoadingFeeds || !newFeedUrl.trim()}
        >
          Import New Feed
        </button>
      </div>

      {/* Preview Section */}
      {showPreview && previewFeed && (
        <div style={styles.previewContainer}>
          <h3 style={styles.header}>Preview Feed</h3>
          {isFetchingPreview ? (
            <p>Loading preview...</p>
          ) : previewFeed.stories?.length > 0 ? (
            previewFeed.stories.map((story) => (
              <div key={story.id} style={styles.storyContainer}>
                <div style={styles.storyHeader}>
                  <div style={styles.storyTitle}>
                    {story.title || 'Untitled Story'}
                  </div>
                </div>
                <div style={styles.storyContent}>
                  <p>{story.description || 'No description available'}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No stories found for this feed.</p>
          )}
        </div>
      )}

      {/* User's Feeds */}
      <div>
        {feeds.map((feed) => (
          <div key={feed.id} style={styles.feedContainer}>
            <div style={styles.feedHeader}>
              <div style={styles.nodeLabel}>
                <span style={styles.icon}>📁</span>
                {`${feed.id ? "ID: " + feed.id : "No ID"} - ${feed.title || feed.url}`}
              </div>
              <div style={styles.feedActions}>
                <button
                  style={styles.toggleStoriesButton}
                  onClick={() => toggleFeedExpansion(feed.id)}
                >
                  {expandedFeeds[feed.id] ? '^' : 'v'}
                </button>
                <input
                  type="checkbox"
                  checked={selectedFeeds.includes(feed.id)}
                  onChange={() => handleFeedSelect(feed.id)}
                  style={styles.checkbox}
                />
                <button
                  style={styles.deleteFeedButton}
                  onClick={() => handleDeleteFeedAndStories(feed.id)}
                >
                  🗑️
                </button>
              </div>
            </div>

            {expandedFeeds[feed.id] && (
              <div style={styles.storiesContainer}>
                {isFetching && !fetchedStories[feed.id] ? (
                  <p>Loading stories...</p>
                ) : fetchedStories[feed.id]?.length > 0 ? (
                  fetchedStories[feed.id].map((story) => (
                    <div key={story.id} style={styles.storyContainer}>
                      <div style={styles.storyHeader}>
                        <button
                          style={styles.toggleStoryButton}
                          onClick={() => toggleStoryExpansion(story.id)}
                        >
                          {expandedStories[story.id] ? '^' : 'v'}
                        </button>
                        <div style={styles.storyTitle}>
                          {story.title}
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedStories.includes(story.id)}
                          onChange={() => handleStorySelect(story.id, feed.id)}
                          style={styles.checkbox}
                        />
                      </div>
                      {expandedStories[story.id] && (
                        <div style={styles.storyContent}>
                          <p>{story.description}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No stories found for this feed.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RSSFeed;