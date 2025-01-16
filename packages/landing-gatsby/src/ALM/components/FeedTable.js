import React, { useState } from "react";
import { Table, Button, message, Spin, Modal } from "antd";
import FeedManagementComponent from "./FeedManagementComponent";
import { useLazyFetchPublicRSSFeedQuery, useLazyFetchPublicJSONFeedQuery } from "../store/api";
import DOMPurify from "dompurify";
import StoryTable from "./StoryTable";

const FeedTable = ({ feeds, onRefreshFeeds }) => {
  const [fetchPublicRSSFeed] = useLazyFetchPublicRSSFeedQuery();
  const [fetchPublicJSONFeed] = useLazyFetchPublicJSONFeedQuery();
  const [expandedFeedStories, setExpandedFeedStories] = useState({});
  const [isFetchingStories, setIsFetchingStories] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [isHtmlModalVisible, setIsHtmlModalVisible] = useState(false);

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
    if (!token) {
      // Show a warning popup if no token is provided
      Modal.warning({
        title: "Token Missing",
        content: "Please generate a public token for this feed before accessing it.",
      });
      return;
    }
    try {
      if (format === "rss") {
        const result = await fetchPublicRSSFeed(token).unwrap();
        const blob = new Blob([result], { type: "application/rss+xml" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else if (format === "json") {
        const result = await fetchPublicJSONFeed(token).unwrap();

        // Open a new window and display JSON data
        const jsonWindow = window.open("", "_blank");
        if (jsonWindow) {
          jsonWindow.document.write(`
            <html>
              <head>
                <title>JSON Feed</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  pre { white-space: pre-wrap; word-wrap: break-word; }
                </style>
              </head>
              <body>
                <h1>JSON Feed</h1>
                <pre>${JSON.stringify(result, null, 2)}</pre>
              </body>
            </html>
          `);
          jsonWindow.document.close();
        } else {
          message.error("Failed to open a new window for JSON display.");
        }
      } else if (format === "html") {
        const result = await fetchPublicRSSFeed(token).unwrap(); // Fetch HTML content as RSS
        setHtmlContent(DOMPurify.sanitize(result));
        setIsHtmlModalVisible(true);
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
      message.error("Failed to fetch feed in the selected format.");
    }
  };

  const closeHtmlModal = () => {
    setIsHtmlModalVisible(false);
    setHtmlContent("");
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
          <Button onClick={() => handleFormatChange(feed.public_token, "html")}>
            HTML
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
    <>
      <Table
        columns={columns}
        dataSource={feeds}
        rowKey="id"
        expandable={{
          expandedRowRender: (feed) => {
            const stories = expandedFeedStories[feed.id] || [];
            return isFetchingStories && !stories.length ? (
              <Spin size="small" />
            ) : (
              <StoryTable feedId={feed.id} />
            );
          },
          onExpand: handleExpand,
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} feeds`,
        }}
      />

      <Modal
        title="HTML Content"
        visible={isHtmlModalVisible}
        onCancel={closeHtmlModal}
        footer={null}
        width="80%"
      >
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Modal>
    </>
  );
};

export default FeedTable;