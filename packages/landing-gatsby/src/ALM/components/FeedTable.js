import React, { useState, useEffect, useCallback } from 'react';
import { Table, Checkbox, Dropdown, Menu, Button, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import StoryTable from './StoryTable'; // Import the StoryTable component
import { useLazyFetchUserStoriesQuery } from '../store/api';
import { generateColumns, filterColumns, handleColumnVisibilityChange } from '../utils/tableUtils'; // Utility functions

const FeedTable = ({ feeds, onDeleteFeedsAndStories, onShowDeleteConfirmation, onDeleteStory }) => {
  const [expandedFeedStories, setExpandedFeedStories] = useState({}); // Store fetched stories for each feed
  const [visibleColumns, setVisibleColumns] = useState([]); // State for visible columns
  const [triggerFetchStories, { isFetching }] = useLazyFetchUserStoriesQuery(); // Lazy fetch stories

  // Initialize visible columns based on feed data
  useEffect(() => {
    if (feeds?.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(Object.keys(feeds[0])); // Initialize columns to show all
    }
  }, [feeds, visibleColumns]);

  // Handle column visibility toggle
  const handleColumnToggle = (column) => {
    setVisibleColumns((prevColumns) =>
      handleColumnVisibilityChange(generateColumns(feeds), prevColumns, column, !prevColumns.includes(column))
    );
  };

  // Handle expanding feed to fetch stories
  const handleExpand = useCallback(
    async (expanded, feed) => {
      if (expanded && !expandedFeedStories[feed.id]) {
        try {
          const result = await triggerFetchStories({ feedId: feed.id }).unwrap();
          setExpandedFeedStories((prev) => ({
            ...prev,
            [feed.id]: result.stories || [],
          }));
        } catch (error) {
          console.error('Error fetching stories:', error);
        }
      }
    },
    [expandedFeedStories, triggerFetchStories]
  );

  // Handle showing the delete confirmation dialog for feed
  const handleFeedDelete = (feedId) => {
    const associatedStories = expandedFeedStories[feedId] || []; // Get the associated stories
    onShowDeleteConfirmation(feedId, associatedStories.map((story) => story.id)); // Delegate to parent component
  };

  // Handle story deletion
  const handleStoryDelete = (storyId) => {
    console.log('Delete confirmation for story ID:', storyId);
    onDeleteStory(storyId); // Delegate to parent component
  };

  // Dynamically generate columns based on feed data
  const allColumns = generateColumns(feeds);
  const dynamicColumns = filterColumns(allColumns, visibleColumns);

  // Primary column to hold the trashcan
  const primaryColumn = {
    title: '', // No title for this column
    key: 'primary',
    render: (_, feed) => (
      <DeleteOutlined
        style={{ color: 'red', cursor: 'pointer', marginRight: '8px' }} // Make the icon small and red with some margin
        onClick={() => handleFeedDelete(feed.id)} // Show confirmation dialog when clicked
      />
    ),
    onCell: (record) => ({
      onClick: (e) => e.stopPropagation(), // Prevent cell click from expanding rows
    }),
  };

  // Expanded row to show the StoryTable
  const expandedRowRender = (feed) => {
    const stories = expandedFeedStories[feed.id] || [];

    if (isFetching && !stories.length) {
      return <Spin size="small" />;
    }

    return <StoryTable stories={stories} feedId={feed.id} onDeleteStory={handleStoryDelete} />;
  };

  return (
    <div>
      <Table
        columns={[primaryColumn, ...dynamicColumns]} // Add the primary column to dynamic columns
        dataSource={feeds}
        rowKey="id"
        expandable={{
          expandedRowRender, // Renders the StoryTable for expanded feeds
          onExpand: handleExpand, // Fetch stories when feed is expanded
          expandIconColumnIndex: 1, // Ensure the built-in expand button is positioned correctly
        }}
      />
    </div>
  );
};

export default FeedTable;
