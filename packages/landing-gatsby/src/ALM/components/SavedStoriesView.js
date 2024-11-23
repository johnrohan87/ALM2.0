import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLazyFetchUserStoriesQuery } from '../store/api';
import { Spin, Card, Button, message } from 'antd';

const SavedStoriesView = () => {
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const [fetchUserStories, { data: storiesData, isFetching }] = useLazyFetchUserStoriesQuery();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserStories({});
    }
  }, [isAuthenticated, fetchUserStories]);

  const stories = storiesData?.stories || [];

  return (
    <div>
      <h3>Saved Stories</h3>
      {isFetching ? (
        <Spin size="large" style={{ margin: '20px 0' }} />
      ) : stories.length === 0 ? (
        <p>No stories saved.</p>
      ) : (
        stories.map((story) => (
          <Card key={story.id} title={story.custom_title || story.data.title} style={{ marginBottom: '16px' }}>
            <p>{story.custom_content || story.data.content}</p>
            <Button
              type="link"
              href={story.data.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read More
            </Button>
          </Card>
        ))
      )}
    </div>
  );
};

export default SavedStoriesView;