import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Checkbox, message } from 'antd';
import { useSelector } from 'react-redux';
import {
  useFetchUserFeedsQuery,
  useLazyFetchUserStoriesQuery,
  useLazyFetchPreviewFeedQuery,
  useImportFeedMutation,
  useDeleteStoriesMutation,
  useDeleteFeedMutation,
} from '../store/api';
import 'antd/dist/antd.css';

// Feed Table Component
const FeedTable = ({ feeds, expandedFeeds, onExpand, selectedFeeds, onFeedSelect, handleDeleteFeed }) => {
  const columns = [
    {
      title: 'Feed URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, feed) => (
        <>
          <Checkbox
            checked={selectedFeeds.includes(feed.id)}
            onChange={() => onFeedSelect(feed.id)}
          />
          <Button danger onClick={() => handleDeleteFeed(feed.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={feeds}
      rowKey="id"
      expandable={{
        expandedRowRender: (feed) => <StoryTable feedId={feed.id} expandedFeeds={expandedFeeds} />,
        onExpand: (expanded, feed) => onExpand(feed.id, expanded),
      }}
    />
  );
};

// Story Table Component
const StoryTable = ({ feedId, expandedFeeds }) => {
  const [triggerFetchStories, { isFetching, data: storiesData }] = useLazyFetchUserStoriesQuery();
  const [expandedStories, setExpandedStories] = useState({});
  const [selectedStories, setSelectedStories] = useState([]);

  useEffect(() => {
    if (expandedFeeds[feedId] && !storiesData) {
      triggerFetchStories({ feedId });
    }
  }, [expandedFeeds, feedId, storiesData, triggerFetchStories]);

  const columns = [
    {
      title: 'Story Title',
      dataIndex: ['data', 'title'],
      key: 'title',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, story) => (
        <Checkbox
          checked={selectedStories.includes(story.id)}
          onChange={() => handleStorySelect(story.id)}
        />
      ),
    },
  ];

  const handleStorySelect = (storyId) => {
    setSelectedStories((prevSelected) =>
      prevSelected.includes(storyId)
        ? prevSelected.filter((id) => id !== storyId)
        : [...prevSelected, storyId]
    );
  };

  if (isFetching) return <p>Loading stories...</p>;
  if (!storiesData) return null;

  return (
    <Table
      columns={columns}
      dataSource={storiesData.stories}
      rowKey="id"
      pagination={false}
    />
  );
};

// Preview Feed Component
const PreviewFeed = ({ url, onPreviewFeed, previewData, isFetchingPreview }) => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Published',
      dataIndex: 'published',
      key: 'published',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      render: (link) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      ),
    },
  ];

  return (
    <>
      <Input.Search
        placeholder="Enter feed URL"
        enterButton="Preview"
        value={url}
        onChange={onPreviewFeed}
        onSearch={() => onPreviewFeed(url)}
      />
      {isFetchingPreview ? (
        <p>Loading preview...</p>
      ) : (
        previewData?.stories && <Table columns={columns} dataSource={previewData.stories} rowKey="link" />
      )}
    </>
  );
};

// Main Component
const RSSFeed = () => {
  const token = useSelector((state) => state.auth.token);
  const { data: feedsData, refetch: refetchFeeds } = useFetchUserFeedsQuery(null, { skip: !token });
  const [triggerFetchPreviewFeed, { data: previewData, isFetching: isFetchingPreview }] = useLazyFetchPreviewFeedQuery();
  const [importFeed] = useImportFeedMutation();
  const [deleteFeed] = useDeleteFeedMutation();

  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [expandedFeeds, setExpandedFeeds] = useState({});
  const [selectedFeeds, setSelectedFeeds] = useState([]);

  const handlePreviewFeed = (url) => {
    if (url) {
      triggerFetchPreviewFeed(url);
    }
  };

  const handleImportFeed = async () => {
    try {
      await importFeed({ url: newFeedUrl }).unwrap();
      message.success('Feed imported successfully');
      setNewFeedUrl('');
      refetchFeeds();
    } catch (error) {
      message.error('Failed to import feed');
    }
  };

  const handleDeleteFeed = async (feedId) => {
    try {
      await deleteFeed(feedId).unwrap();
      refetchFeeds();
      message.success('Feed deleted');
    } catch (error) {
      message.error('Failed to delete feed');
    }
  };

  const toggleFeedExpansion = (feedId, expanded) => {
    setExpandedFeeds((prev) => ({ ...prev, [feedId]: expanded }));
  };

  const handleFeedSelect = (feedId) => {
    setSelectedFeeds((prev) =>
      prev.includes(feedId) ? prev.filter((id) => id !== feedId) : [...prev, feedId]
    );
  };

  const feeds = feedsData?.feeds || [];

  return (
    <div style={{ padding: 24 }}>
      <h2>RSS Feeds</h2>

      <PreviewFeed
        url={newFeedUrl}
        onPreviewFeed={(e) => setNewFeedUrl(e.target.value)}
        previewData={previewData}
        isFetchingPreview={isFetchingPreview}
      />

      <Button type="primary" onClick={handleImportFeed} disabled={!newFeedUrl}>
        Import Feed
      </Button>

      <FeedTable
        feeds={feeds}
        expandedFeeds={expandedFeeds}
        onExpand={toggleFeedExpansion}
        selectedFeeds={selectedFeeds}
        onFeedSelect={handleFeedSelect}
        handleDeleteFeed={handleDeleteFeed}
      />
    </div>
  );
};

export default RSSFeed;
