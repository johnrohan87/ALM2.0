import React, { useState } from "react";
import { Table, Spin, Popconfirm, Button } from "antd";
import FeedManagementComponent from "./FeedManagementComponent";
import { useLazyFetchUserStoriesQuery } from "../store/api";
import StoryTable from "./StoryTable";
import useDeletionHandler from "../hooks/useDeletionHandler";

const FeedTable = ({ feeds, onRefreshFeeds }) => {
  const [expandedFeedStories, setExpandedFeedStories] = useState({});
  const [triggerFetchStories, { isFetching: isFetchingStories }] = useLazyFetchUserStoriesQuery();
  const { deleteFeedAndSync } = useDeletionHandler(onRefreshFeeds);

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

  const handleDeleteFeed = async (feedId) => {
    await deleteFeedAndSync(feedId);
  };

  return (
    <Table
      columns={[
        { title: "Feed URL", dataIndex: "url", key: "url" },
        { title: "Management", key: "management", render: (_, feed) => (
          <div>
            <FeedManagementComponent feed={feed} onRefresh={onRefreshFeeds} />
            <Popconfirm
              title="Are you sure you want to delete this feed?"
              onConfirm={() => handleDeleteFeed(feed.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete Feed</Button>
            </Popconfirm>
          </div>                
        ) },
      ]}
      dataSource={feeds}
      rowKey="id"
      expandable={{ expandedRowRender, onExpand: handleExpand }}
    />
  );
};

export default FeedTable;