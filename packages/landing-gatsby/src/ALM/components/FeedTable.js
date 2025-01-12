import React, { useState } from "react";
import { Table, Button, message, Spin } from "antd";
import FeedManagementComponent from "./FeedManagementComponent";
import { useLazyFetchPublicRSSFeedQuery, useLazyFetchPublicJSONFeedQuery } from "../store/api";
import StoryTable from "./StoryTable";

const FeedTable = ({ feeds, onRefreshFeeds }) => {
  const [expandedFeedStories, setExpandedFeedStories] = useState({});
  const [fetchPublicRSSFeed] = useLazyFetchPublicRSSFeedQuery();
  const [fetchPublicJSONFeed] = useLazyFetchPublicJSONFeedQuery();
  const [isFetchingStories, setIsFetchingStories] = useState(false);

  const handleExpand = async (expanded, feed) => {
    if (expanded && !expandedFeedStories[feed.id]) {
      setIsFetchingStories(true);
      try {
        const result = await fetchPublicRSSFeed(feed.public_token).unwrap();
        setExpandedFeedStories((prev) => ({
          ...prev,
          [feed.id]: result.stories || [],
        }));
      } catch (error) {
        console.error("Error fetching stories:", error);
        message.error("Failed to fetch stories. Please try again.");
      } finally {
        setIsFetchingStories(false);
      }
    }
  };

  const handleFormatChange = async (token, format) => {
    try {
      if (format === "rss") {
        const result = await fetchPublicRSSFeed(token).unwrap();
        const blob = new Blob([result], { type: "application/rss+xml" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else if (format === "json") {
        const result = await fetchPublicJSONFeed(token).unwrap();
        console.log("JSON Data:", result);
        message.success("Fetched feed in JSON format.");
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
      message.error("Failed to fetch feed in the selected format.");
    }
  };

  const expandedRowRender = (feed) => {
    const stories = expandedFeedStories[feed.id] || [];
    return isFetchingStories && !stories.length ? (
      <Spin size="small" />
    ) : (
      <StoryTable feedId={feed.id} />
    );
  };

  const columns = [
    {
      title: "Feed URL",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "Format",
      key: "format",
      render: (_, feed) => (
        <div>
          <Button onClick={() => handleFormatChange(feed.public_token, "json")}>
            JSON
          </Button>
          <Button onClick={() => handleFormatChange(feed.public_token, "rss")}>
            RSS
          </Button>
        </div>
      ),
    },
    {
      title: "Management",
      key: "management",
      render: (_, feed) => (
        <FeedManagementComponent feed={feed} onRefresh={onRefreshFeeds} />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={feeds}
      rowKey="id"
      expandable={{ expandedRowRender, onExpand: handleExpand }}
      pagination={{
        pageSize: 10,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} feeds`,
      }}
    />
  );
};

export default FeedTable;
