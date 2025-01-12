import React, { useState } from "react";
import { Table, Button, Spin, message } from "antd";
import FeedManagementComponent from "./FeedManagementComponent";
import { useLazyFetchUserStoriesQuery, useLazyFetchPublicFeedQuery } from "../store/api";
import StoryTable from "./StoryTable";

const FeedTable = ({ feeds, onRefreshFeeds }) => {
  const [expandedFeedStories, setExpandedFeedStories] = useState({});
  const [triggerFetchStories, { isFetching: isFetchingStories }] = useLazyFetchUserStoriesQuery();
  const [fetchPublicFeed, { isFetching: isFetchingFeed }] = useLazyFetchPublicFeedQuery();
  const [format, setFormat] = useState("json"); // Track selected format for feeds
  const [cachedFeeds, setCachedFeeds] = useState({});

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
        message.error("Failed to fetch stories. Please try again.");
      }
    }
  };

  const handleFormatChange = async (token, newFormat) => {
    try {
      console.log(`Fetching feed in ${newFormat} format with token: ${token}`);
      const result = await fetchPublicFeed(token).unwrap();
  
      if (newFormat === "rss") {
        if (typeof result === "string" && result.startsWith("<?xml")) {
          const blob = new Blob([result], { type: "application/rss+xml" });
          const url = URL.createObjectURL(blob);
          console.log("RSS Data:", result);
          window.open(url, "_blank");
        } else {
          console.error("Invalid RSS data format:", result);
          message.error("Failed to fetch valid RSS data.");
        }
      } else {
        console.log("JSON Data:", result);
        message.info("Fetched feed in JSON format.");
      }
    } catch (error) {
      console.error("Error fetching feed format:", error);
      message.error("Failed to fetch feed in selected format.");
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
          <Button
            loading={isFetchingFeed}
            onClick={() => handleFormatChange(feed.public_token, "json")}
          >
            JSON
          </Button>
          <Button
            loading={isFetchingFeed}
            onClick={() => handleFormatChange(feed.public_token, "rss")}
          >
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