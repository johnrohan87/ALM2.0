import React, { useState } from "react";
import { Table, Spin } from "antd";
import FeedManagementComponent from "./FeedManagementComponent";
import { useLazyFetchUserStoriesQuery } from "../store/api";
import StoryTable from "./StoryTable";

const FeedTable = ({ feeds, onRefreshFeeds }) => {
  const [expandedFeedStories, setExpandedFeedStories] = useState({});
  const [triggerFetchStories, { isFetching: isFetchingStories }] = useLazyFetchUserStoriesQuery();

  const expandedRowRender = (feed) => {
    const stories = expandedFeedStories[feed.id] || [];
    if (isFetchingStories && !stories.length) {
      return <Spin size="small" />;
    }
    return <StoryTable stories={stories} />;
  };

  const handleExpand = async (expanded, feed) => {
    if (expanded && !expandedFeedStories[feed.id]) {
      try {
        const result = await triggerFetchStories(feed.id).unwrap();
        setExpandedFeedStories((prev) => ({
          ...prev,
          [feed.id]: result.stories || [],
        }));
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    }
  };

  return (
    <Table
      columns={[
        { title: "Feed URL", dataIndex: "url", key: "url" },
        { title: "Management", key: "management", render: (_, feed) => (
          <FeedManagementComponent feed={feed} onRefresh={onRefreshFeeds} />
        ) },
      ]}
      dataSource={feeds}
      rowKey="id"
      expandable={{ expandedRowRender, onExpand: handleExpand }}
    />
  );
};

export default FeedTable;