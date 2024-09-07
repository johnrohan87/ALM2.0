// StoryTable.js
import React, { useState, useEffect } from 'react';
import { Table, Checkbox } from 'antd';
import { useLazyFetchUserStoriesQuery } from '../store/api';
import PropTypes from 'prop-types';

const StoryTable = ({ feedId, expandedFeeds, selectedStoriesForFeed, onStorySelect }) => {
  const [triggerFetchStories, { isFetching, data: storiesData, error }] = useLazyFetchUserStoriesQuery();

  useEffect(() => {
    if (expandedFeeds[feedId] && !storiesData && !isFetching) {
      triggerFetchStories({ feedId });
    }
  }, [expandedFeeds, feedId, storiesData, triggerFetchStories, isFetching]);

  // Add logging to debug
  useEffect(() => {
    console.log(`StoryTable: feedId=${feedId}, selectedStoriesForFeed=${JSON.stringify(selectedStoriesForFeed)}`);
  }, [feedId, selectedStoriesForFeed]);

  const columns = [
    {
      title: 'Story Title',
      dataIndex: ['data', 'title'],
      key: 'title',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, story) => (
        <Checkbox
          checked={(selectedStoriesForFeed || []).includes(story.id)}
          onChange={() => onStorySelect(story.id, feedId)}
        />
      ),
    },
  ];

  if (isFetching) return <p>Loading stories...</p>;
  if (error) return <p>Error loading stories.</p>;
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

StoryTable.propTypes = {
  feedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  expandedFeeds: PropTypes.object.isRequired,
  selectedStoriesForFeed: PropTypes.array.isRequired,
  onStorySelect: PropTypes.func.isRequired,
};

export default StoryTable;