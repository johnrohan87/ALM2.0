import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  useFetchUserFeedsQuery,
  useLazyFetchUserStoriesQuery,
  useImportFeedMutation,
  useDeleteFeedMutation,
  useDeleteStoriesMutation,
} from '../store/api';
import { styles } from './styles/rss.styles';

const RSSFeed = () => {
  const token = useSelector((state) => state.auth.token);
  const { data: feedsData, isLoading: isLoadingFeeds, refetch: refetchFeeds } = useFetchUserFeedsQuery(null, {
    skip: !token,
  });

  const feeds = feedsData?.feeds || [];
  const [expandedFeeds, setExpandedFeeds] = useState({});
  const [expandedStories, setExpandedStories] = useState({});
  const [selectedFeeds, setSelectedFeeds] = useState([]); // Track selected feeds
  const [selectedStories, setSelectedStories] = useState([]);
  const [fetchedStories, setFetchedStories] = useState({});

  // Use lazy query for fetching stories
  const [triggerFetchStories, { isFetching }] = useLazyFetchUserStoriesQuery();
  const [importFeed] = useImportFeedMutation();
  const [deleteFeed] = useDeleteFeedMutation();
  const [deleteStories] = useDeleteStoriesMutation();

  const [newFeedUrl, setNewFeedUrl] = useState('');

  useEffect(() => {
    selectedFeeds.forEach(async (feedId) => {
      if (!fetchedStories[feedId]) {
        const result = await triggerFetchStories({ feedId }).unwrap();
        setFetchedStories((prev) => ({ ...prev, [feedId]: result.stories }));
        setSelectedStories((prevSelected) => [
          ...prevSelected,
          ...result.stories.map((story) => story.id),
        ]);
      }
    });
  }, [selectedFeeds]);

  const toggleFeedExpansion = (feedId) => {
    setExpandedFeeds((prev) => ({ ...prev, [feedId]: !prev[feedId] }));

    if (!expandedFeeds[feedId] && !fetchedStories[feedId]) {
      triggerFetchStories({ feedId }).unwrap().then((result) => {
        setFetchedStories((prev) => ({ ...prev, [feedId]: result.stories }));
      });
    }
  };

  const toggleStoryExpansion = (storyId) => {
    setExpandedStories((prev) => ({ ...prev, [storyId]: !prev[storyId] }));
  };

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

  const handleFeedSelect = (feedId) => {
    if (selectedFeeds.includes(feedId)) {
      setSelectedFeeds((prevSelected) => prevSelected.filter((id) => id !== feedId));
      setSelectedStories((prevSelected) =>
        prevSelected.filter((storyId) => !fetchedStories[feedId]?.map((s) => s.id).includes(storyId))
      );
    } else {
      setSelectedFeeds((prevSelected) => [...prevSelected, feedId]);
      if (fetchedStories[feedId]) {
        setSelectedStories((prevSelected) => [
          ...prevSelected,
          ...fetchedStories[feedId].map((story) => story.id),
        ]);
      }
    }
  };

  const handleDeleteFeedAndStories = async (feedId) => {
    try {
      if (selectedFeeds.includes(feedId)) {
        // If the feed itself is selected, delete the feed
        await deleteFeed(feedId).unwrap();
        setSelectedFeeds((prev) => prev.filter((id) => id !== feedId));
        setExpandedFeeds((prev) => ({ ...prev, [feedId]: false }));
        refetchFeeds();  // Refetch feeds to update the list
      } else if (selectedStories.length > 0) {
        // If only stories are selected, delete the selected stories
        const storiesToDelete = fetchedStories[feedId].filter((story) =>
          selectedStories.includes(story.id)
        ).map((story) => story.id);
  
        if (storiesToDelete.length > 0) {
          await deleteStories(storiesToDelete).unwrap();
          setSelectedStories((prev) => prev.filter((id) => !storiesToDelete.includes(id)));
  
          // After deletion, refetch the stories for the feed
          const updatedStories = await triggerFetchStories({ feedId }).unwrap();
  
          // Update the fetchedStories state to trigger a re-render
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

  const handleImportFeed = async () => {
    if (newFeedUrl.trim()) {
      try {
        await importFeed({ url: newFeedUrl }).unwrap();
        setNewFeedUrl('');
        refetchFeeds();
      } catch (error) {
        console.error('Failed to import feed:', error);
      }
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
        />
        <button
          style={styles.button}
          onClick={handleImportFeed}
          disabled={isLoadingFeeds || !newFeedUrl.trim()}
        >
          Import New Feed
        </button>
      </div>

      {feeds.length === 0 && !isLoadingFeeds && <div>No Feeds Found</div>}

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
                          {story.custom_title || story.data.title}
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
                          <p>{story.custom_content || story.data.summary}</p>
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