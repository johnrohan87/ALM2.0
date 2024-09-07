import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Spin, Checkbox } from 'antd';
import { useLazyFetchUserStoriesQuery } from '../store/api';

const FeedTable = ({ feeds }) => {
  const [filteredFeeds, setFilteredFeeds] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [expandedFeedStories, setExpandedFeedStories] = useState({}); // Track fetched stories for each feed
  const [visibleColumns, setVisibleColumns] = useState([]); // Track visible columns for feeds
  const [allColumns, setAllColumns] = useState([]); // Track all feed columns
  const [hiddenColumns, setHiddenColumns] = useState([]); // Track hidden feed columns
  const [visibleStoryColumns, setVisibleStoryColumns] = useState({}); // Track visible columns for stories
  const [allStoryColumns, setAllStoryColumns] = useState({}); // Track all story columns
  const [hiddenStoryColumns, setHiddenStoryColumns] = useState({}); // Track hidden story columns

  const [triggerFetchStories, { isFetching }] = useLazyFetchUserStoriesQuery(); // Lazy fetch stories

  // Helper function to generate columns dynamically
  const generateColumns = useCallback((data) => {
    if (data.length === 0) return [];

    const columnKeys = Object.keys(data[0]);

    return columnKeys.map((key) => {
      const isObject = typeof data[0][key] === 'object' && data[0][key] !== null;

      return {
        title: key.replace('_', ' ').toUpperCase(),
        dataIndex: key,
        key,
        render: (value) => {
          if (isObject) {
            // Render objects as JSON strings
            return JSON.stringify(value, null, 2);
          }
          return value ? value.toString() : 'N/A'; // Handle missing or undefined values
        },
        hidden: data.every((item) => !item[key] || item[key] === 'N/A'), // Hide by default if all values are empty or "N/A"
      };
    });
  }, []);

  // Initialize filtered feeds on component mount
  useEffect(() => {
    if (feeds.length > 0 && filteredFeeds.length === 0) {
      setFilteredFeeds(feeds);
    }
  }, [feeds, filteredFeeds]);

  // Populate visible and hidden columns for feeds
  useEffect(() => {
    if (feeds.length > 0) {
      const feedColumns = generateColumns(feeds);
      const initialVisibleColumns = feedColumns.filter((col) => !col.hidden);
      const initialHiddenColumns = feedColumns.filter((col) => col.hidden);

      setVisibleColumns(initialVisibleColumns);
      setHiddenColumns(initialHiddenColumns);
      setAllColumns(feedColumns);
    }
  }, [feeds, generateColumns]);

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

  // Effect to set story columns when expandedFeedStories updates
  useEffect(() => {
    Object.keys(expandedFeedStories).forEach((feedId) => {
      const stories = expandedFeedStories[feedId] || [];
      const storyColumns = generateColumns(stories);

      setVisibleStoryColumns((prev) => ({
        ...prev,
        [feedId]: storyColumns.filter((col) => !col.hidden),
      }));
      setHiddenStoryColumns((prev) => ({
        ...prev,
        [feedId]: storyColumns.filter((col) => col.hidden),
      }));
      setAllStoryColumns((prev) => ({
        ...prev,
        [feedId]: storyColumns,
      }));
    });
  }, [expandedFeedStories, generateColumns]);

  // Expanded row render function to show the stories associated with each feed
  const expandedRowRender = useCallback(
    (feed) => {
      const stories = expandedFeedStories[feed.id] || [];

      if (isFetching && !stories.length) {
        return <Spin size="small" />;
      }

      const visibleStoryCols = visibleStoryColumns[feed.id] || [];
      return (
        <>
          <div style={{ marginBottom: 10 }}>
            <span>Show/Hide Story Columns: </span>
            {allStoryColumns[feed.id]?.map((col) => (
              <Checkbox
                key={col.key}
                checked={visibleStoryCols.some((visibleCol) => visibleCol.key === col.key)}
                onChange={(e) => handleStoryColumnVisibilityChange(feed.id, col.key, e.target.checked)}
                style={{ marginLeft: 10 }}
              >
                {col.title}
              </Checkbox>
            ))}
          </div>

          <Table
            columns={visibleStoryCols} // Only show visible story columns
            dataSource={stories}
            pagination={false}
            rowKey="id"
          />
        </>
      );
    },
    [expandedFeedStories, visibleStoryColumns, allStoryColumns, isFetching]
  );

  // Toggle visibility of columns for feeds
  const handleColumnVisibilityChange = (columnKey, checked) => {
    if (checked) {
      const column = allColumns.find((col) => col.key === columnKey);
      setVisibleColumns((prev) => [...prev, column]);
      setHiddenColumns((prev) => prev.filter((col) => col.key !== columnKey));
    } else {
      const column = visibleColumns.find((col) => col.key === columnKey);
      setHiddenColumns((prev) => [...prev, column]);
      setVisibleColumns((prev) => prev.filter((col) => col.key !== columnKey));
    }
  };

  // Toggle visibility of columns for stories
  const handleStoryColumnVisibilityChange = (feedId, columnKey, checked) => {
    if (checked) {
      const column = allStoryColumns[feedId].find((col) => col.key === columnKey);
      setVisibleStoryColumns((prev) => ({
        ...prev,
        [feedId]: [...prev[feedId], column],
      }));
      setHiddenStoryColumns((prev) => ({
        ...prev,
        [feedId]: prev[feedId].filter((col) => col.key !== columnKey),
      }));
    } else {
      const column = visibleStoryColumns[feedId].find((col) => col.key === columnKey);
      setHiddenStoryColumns((prev) => ({
        ...prev,
        [feedId]: [...prev[feedId], column],
      }));
      setVisibleStoryColumns((prev) => ({
        ...prev,
        [feedId]: prev[feedId].filter((col) => col.key !== columnKey), // Removed the extra closing parenthesis
      }));
    }
  };
  

  return (
    <div>
      <Input.Search
        placeholder="Search in feeds"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {/* Checkbox filter for hidden columns */}
      <div style={{ marginBottom: 20 }}>
        <span>Show/Hide Feed Columns: </span>
        {allColumns.map((col) => (
          <Checkbox
            key={col.key}
            checked={visibleColumns.some((visibleCol) => visibleCol.key === col.key)}
            onChange={(e) => handleColumnVisibilityChange(col.key, e.target.checked)}
            style={{ marginLeft: 10 }}
          >
            {col.title}
          </Checkbox>
        ))}
      </div>

      <Table
        columns={visibleColumns} // Only show visible columns for feeds
        dataSource={filteredFeeds}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender, // Render stories when a feed is expanded
          onExpand: handleExpand, // Fetch stories when a feed is expanded
        }}
      />
    </div>
  );
};

export default FeedTable;