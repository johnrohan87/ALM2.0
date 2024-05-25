import React, { useState } from 'react';
import { useFetchUserFeedQuery, useImportFeedMutation, useEditStoryMutation } from '../store/apiSlice';

const RSSPage = () => {
  const { data: userFeed, isLoading: isFetching, isError } = useFetchUserFeedQuery();
  const [importFeed, { isLoading: isImporting }] = useImportFeedMutation();
  const [editStory] = useEditStoryMutation();

  const [newFeedUrl, setNewFeedUrl] = useState('');

  const handleImportFeed = async () => {
    if (newFeedUrl) {
      await importFeed({ url: newFeedUrl });
      setNewFeedUrl('');
    }
  };

  const handleEditStory = async (storyId, customTitle, customContent) => {
    await editStory({ storyId, storyData: { custom_title: customTitle, custom_content: customContent } });
  };

  if (isFetching) return <div>Loading feeds...</div>;
  if (isError) return <div>Error loading feeds.</div>;

  return (
    <div>
      <h2>RSS Feeds</h2>
      <input
        type="text"
        value={newFeedUrl}
        onChange={(e) => setNewFeedUrl(e.target.value)}
        placeholder="Enter feed URL"
      />
      <button onClick={handleImportFeed} disabled={isImporting}>
        Import New Feed
      </button>

      {userFeed?.feed.map(feed => (
        <div key={feed.url}>
          <h3>{feed.feedTitle}</h3>
          <ul>
            {feed.items.map(story => (
              <li key={story.title}>
                <h4>{story.title}</h4>
                <p>{story.content}</p>
                {/* Example edit functionality, expand upon this based on actual data structure and requirements */}
                <button onClick={() => handleEditStory(story.id, "New Title", "New Content")}>
                  Edit Story
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RSSPage;
