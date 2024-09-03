import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFetchUserFeedsQuery, useFetchUserStoriesQuery, useImportFeedMutation, useDeleteStoriesMutation } from '../store/api';
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel } from '@reach/accordion';
import '@reach/accordion/styles.css'; // If you need some default styles

const RSSFeed = () => {
  const token = useSelector((state) => state.auth.token);
  const { data: feeds, isLoading: isLoadingFeeds, refetch: refetchFeeds } = useFetchUserFeedsQuery(null, {
    skip: !token, // Skip the query if token is not available
  });
  const [selectedFeedId, setSelectedFeedId] = useState(null);
  const { data: stories, isLoading: isLoadingStories, refetch: refetchStories } = useFetchUserStoriesQuery(
    { feedId: selectedFeedId },
    {
      skip: !token || !selectedFeedId, // Skip if token or selectedFeedId is not available
    }
  );
  const [importFeed] = useImportFeedMutation();
  const [deleteStories] = useDeleteStoriesMutation();

  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [selectedStories, setSelectedStories] = useState([]);

  const handleFeedSelect = (feedId) => {
    console.log("Selected Feed ID:", feedId);
    setSelectedFeedId(feedId);
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

  const handleDeleteStories = async () => {
    if (selectedStories.length > 0) {
      try {
        await deleteStories(selectedStories).unwrap();
        setSelectedStories([]);
        refetchStories();
      } catch (error) {
        console.error('Failed to delete stories:', error);
      }
    }
  };

  const handleStorySelect = (storyId) => {
    setSelectedStories((prevSelected) =>
      prevSelected.includes(storyId)
        ? prevSelected.filter((id) => id !== storyId)
        : [...prevSelected, storyId]
    );
  };

  if (isLoadingFeeds) return <div>Loading Feeds...</div>;
  if (isLoadingStories) return <div>Loading Stories...</div>;

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

      <Accordion>
        {Array.isArray(feeds) && feeds.length > 0 ? (
          feeds.map((feed) => (
            <AccordionItem key={feed.id}>
              <AccordionHeader onClick={() => handleFeedSelect(feed.id)}>
                {feed.title}
              </AccordionHeader>
              <AccordionPanel>
                {stories && stories.length > 0 ? (
                  stories.map((story) => (
                    <div key={story.id} style={styles.storyContainer}>
                      <h3 style={styles.storyTitle}>{story.custom_title || story.data.title}</h3>
                      <p style={styles.storyContent}>{story.custom_content || story.data.summary}</p>
                      <input
                        type="checkbox"
                        checked={selectedStories.includes(story.id)}
                        onChange={() => handleStorySelect(story.id)}
                      />
                    </div>
                  ))
                ) : (
                  <p>No stories found for this feed.</p>
                )}
              </AccordionPanel>
            </AccordionItem>
          ))
        ) : (
          <div>No Feeds Found</div>
        )}
      </Accordion>

      <button
        style={styles.deleteButton}
        onClick={handleDeleteStories}
        disabled={selectedStories.length === 0}
      >
        Delete Selected Stories
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  input: {
    flex: '1',
    padding: '10px',
    marginRight: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'red',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '20px',
  },
  storyContainer: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9',
  },
  storyTitle: {
    marginBottom: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  storyContent: {
    marginBottom: '10px',
    fontSize: '14px',
  },
};

export default RSSFeed;
