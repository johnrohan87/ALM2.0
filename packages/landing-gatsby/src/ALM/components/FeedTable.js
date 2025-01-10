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
      const result = await fetchPublicFeed(token).unwrap();

      if (newFormat === "rss") {
        const blob = new Blob([result], { type: "application/rss+xml" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        message.info("Fetched feed in JSON format. Check the console for data.");
        console.log(result);
      }

      setFormat(newFormat);
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
      title: "Public Token",
      dataIndex: "public_token",
      key: "public_token",
      render: (token) => (
        <span>
          {token}{" "}
          <Button
            type="link"
            onClick={() => navigator.clipboard.writeText(token)}
          >
            Copy Token
          </Button>
        </span>
      ),
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