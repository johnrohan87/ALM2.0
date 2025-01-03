import React, { useState } from "react";
import DynamicPreviewTable from "./DynamicPreviewTable";
import PreviewManagementComponent from "./PreviewManagementComponent";
import { usePreviewFeedMutation } from "../store/api";

const FeedPreviewer = ({ onFeedAdded, refreshFeeds }) => {
  const [previewFeed] = usePreviewFeedMutation();
  const [previewData, setPreviewData] = useState(null);
  const [feedUrl, setFeedUrl] = useState("");
  const [error, setError] = useState("");

  const handlePreview = async () => {
    setError("");
    try {
      const data = await previewFeed({ url: feedUrl }).unwrap();
      console.log("Preview data received:", data);
      setPreviewData({ ...data, url: feedUrl });
    } catch (err) {
      console.error("Preview failed:", err);
      setError("Failed to fetch feed preview. Please check the URL.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Feed URL"
        value={feedUrl}
        onChange={(e) => setFeedUrl(e.target.value)}
      />
      <button onClick={handlePreview}>Preview</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {previewData && (
        <>
          <DynamicPreviewTable previewData={previewData} />
          <PreviewManagementComponent
            feed={{ ...previewData.feed, url: feedUrl }}
            onFeedAdded={onFeedAdded} 
            refetchFeeds={refreshFeeds}
          />
        </>
      )}
    </div>
  );
};

export default FeedPreviewer;