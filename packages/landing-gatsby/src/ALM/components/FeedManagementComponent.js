import React from "react";
import { Checkbox, Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useUpdateFeedMutation, useDeleteFeedMutation } from "../store/api";

const FeedManagementComponent = ({ feed = {}, onRefresh }) => {
  const [updateFeed] = useUpdateFeedMutation();
  const [deleteFeed] = useDeleteFeedMutation();

  const saveAllNewStories = feed.save_all_new_stories ?? false;
  const isFollowing = feed.is_following ?? false;

  const handleToggleAutoSave = async () => {
    try {
      await updateFeed({
        id: feed.id,
        save_all_new_stories: !saveAllNewStories,
      }).unwrap();
      message.success("Auto-save setting updated.");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating auto-save:", error);
      message.error("Failed to update auto-save. Please try again.");
    }
  };

  const handleToggleFollow = async () => {
    try {
      await updateFeed({
        id: feed.id,
        is_following: !isFollowing,
      }).unwrap();
      message.success("Follow status updated.");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating follow status:", error);
      message.error("Failed to update follow status. Please try again.");
    }
  };

  const handleGenerateToken = async () => {
    try {
      await updateFeed({
        id: feed.id,
        public_token: feed.public_token ? null : "GENERATE",
      }).unwrap();
      message.success("Public token updated.");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error generating public token:", error);
      message.error("Failed to update public token. Please try again.");
    }
  };

  const handleDeleteFeed = async () => {
    try {
      await deleteFeed({ feed_id: feed.id }).unwrap();
      message.success("Feed deleted successfully.");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting feed:", error);
      message.error("Failed to delete feed. Please try again.");
    }
  };

  if (!feed || !feed.id) {
    return <div>No feed data available.</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <Checkbox checked={saveAllNewStories} onChange={handleToggleAutoSave}>
          Save All Stories
        </Checkbox>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Checkbox checked={isFollowing} onChange={handleToggleFollow}>
          Following
        </Checkbox>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Popconfirm
          title={
            feed.public_token
              ? "Remove public token?"
              : "Generate public token for this feed?"
          }
          onConfirm={handleGenerateToken}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary">
            {feed.public_token ? "Remove Token" : "Generate Token"}
          </Button>
        </Popconfirm>
      </div>
      <div>
        <Popconfirm
          title="Are you sure you want to delete this feed?"
          onConfirm={handleDeleteFeed}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            <DeleteOutlined /> Delete Feed
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default FeedManagementComponent;