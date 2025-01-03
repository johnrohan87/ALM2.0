import React, { useState } from "react";
import { Checkbox, Button } from "antd";
import { useImportFeedMutation } from "../store/api";

const PreviewManagementComponent = ({ feed = {}, onSave, onFeedAdded, refetchFeeds }) => {
  const [autoSaveStories, setAutoSaveStories] = useState(feed.save_all_new_stories || false);
  const [isFollowing, setIsFollowing] = useState(feed.is_following || true);
  const [importFeed] = useImportFeedMutation();

  const handleSave = () => {
    onSave({ save_all_new_stories: autoSaveStories, is_following: isFollowing });
  };

  const handleSaveFeed = async () => {
    if (!feed.url) {
      console.error("Feed URL is missing!");
      alert("Feed URL is required to save the feed.");
      return;
    }

    const payload = {
      url: feed.url,
      save_all_new_stories: autoSaveStories,
      is_following: isFollowing,
    };

    try {
      console.log("Save feed payload:", payload);

      const response = await importFeed(payload).unwrap();
      console.log("Feed saved successfully:", response);

      if (onFeedAdded) {
        console.log("Calling onFeedAdded with:", { id: response.feed_id, ...payload });
        onFeedAdded({ id: response.feed_id, ...payload });
      }

      if (refetchFeeds) await refetchFeeds();
    } catch (error) {
      console.error("Error saving feed:", error);
      alert("Failed to save the feed. Please try again.");
    }
  };

  return (
    <div>
      <Checkbox
        checked={autoSaveStories}
        onChange={(e) => setAutoSaveStories(e.target.checked)}
      >
        Save All Stories Automatically
      </Checkbox>
      <Checkbox
        checked={isFollowing}
        onChange={(e) => setIsFollowing(e.target.checked)}
      >
        Follow Feed
      </Checkbox>
      <div style={{ marginTop: "10px" }}>
        <Button type="primary" onClick={handleSave} style={{ marginRight: "10px" }}>
          Confirm Settings
        </Button>
        <Button type="primary" onClick={handleSaveFeed}>
          Save Feed
        </Button>
      </div>
    </div>
  );
};

export default PreviewManagementComponent;