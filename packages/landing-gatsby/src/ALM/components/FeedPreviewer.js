import React, { useState } from "react";
import DynamicPreviewTable from "./DynamicPreviewTable";
import PreviewManagementComponent from "./PreviewManagementComponent";
import { usePreviewFeedMutation } from "../store/api";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const FeedPreviewer = ({ onFeedAdded, refreshFeeds }) => {
  const [previewFeed] = usePreviewFeedMutation();
  const [previewData, setPreviewData] = useState(null);
  const [feedUrl, setFeedUrl] = useState("");
  const [error, setError] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(null);

  // Function to validate URL format
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFeedUrl(url);
    setIsValidUrl(validateUrl(url));
    setError(""); // Clear any previous error
  };

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

  const handleReset = () => {
    setPreviewData(null);
    setFeedUrl("");
    setIsValidUrl(null);
    setError("");
    if (refreshFeeds) refreshFeeds(); // Refetch feeds if needed
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter Feed URL"
          value={feedUrl}
          onChange={handleUrlChange}
          style={{ flexGrow: 1, marginRight: "10px" }}
        />
        {isValidUrl === true ? (
          <CheckCircleOutlined style={{ color: "green", fontSize: "24px" }} />
        ) : isValidUrl === false ? (
          <CloseCircleOutlined style={{ color: "red", fontSize: "24px" }} />
        ) : null}
      </div>
      {isValidUrl && (
        <div style={{ marginBottom: "10px" }}>
          <button onClick={handlePreview}>Preview</button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isValidUrl && (
        <PreviewManagementComponent
          feed={{ url: feedUrl }}
          onFeedAdded={(newFeed) => {
            onFeedAdded(newFeed);
            handleReset(); // Reset preview component on successful save
          }}
          refetchFeeds={refreshFeeds}
        />
      )}
      {previewData && (
        <DynamicPreviewTable previewData={previewData} />
      )}
    </div>
  );
};

export default FeedPreviewer;