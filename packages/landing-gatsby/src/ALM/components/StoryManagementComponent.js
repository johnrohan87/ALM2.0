import React from "react";
import { Checkbox, Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useUpdateStoryMutation, useDeleteStoriesMutation } from "../store/api";

const StoryManagementComponent = ({ story, onStoryUpdated }) => {
  const [updateStory] = useUpdateStoryMutation();
  const [deleteStories] = useDeleteStoriesMutation();

  const handleToggleSave = async () => {
    try {
      const updatedStory = await updateStory({
        storyId: story.id,
        data: { is_saved: !story.is_saved },
      }).unwrap();

      message.success("Story save status updated.");
      if (onStoryUpdated) onStoryUpdated({ ...story, is_saved: updatedStory.is_saved });
    } catch (error) {
      console.error("Error toggling save status:", error);
      message.error("Failed to update save status. Please try again.");
    }
  };

  const handleToggleWatched = async () => {
    try {
      const updatedStory = await updateStory({
        storyId: story.id,
        data: { is_watched: !story.is_watched },
      }).unwrap();

      message.success("Story watched status updated.");
      if (onStoryUpdated) onStoryUpdated({ ...story, is_watched: updatedStory.is_watched });
    } catch (error) {
      console.error("Error toggling watched status:", error);
      message.error("Failed to update watched status. Please try again.");
    }
  };

  const handleDeleteStory = async () => {
    try {
      await deleteStories({ story_ids: [story.id] }).unwrap();
      message.success("Story deleted successfully.");
      if (onStoryUpdated) onStoryUpdated(null, story.id); // Notify parent to remove story
    } catch (error) {
      console.error("Error deleting story:", error);
      message.error("Failed to delete story. Please try again.");
    }
  };

  return (
    <div>
      <Checkbox
        checked={story.is_saved}
        onChange={handleToggleSave}
        style={{ marginRight: "10px" }}
      >
        Save
      </Checkbox>
      <Checkbox
        checked={story.is_watched}
        onChange={handleToggleWatched}
        style={{ marginRight: "10px" }}
      >
        Watched
      </Checkbox>
      <Popconfirm
        title="Are you sure you want to delete this story?"
        onConfirm={handleDeleteStory}
        okText="Yes"
        cancelText="No"
      >
        <Button type="primary" danger>
          <DeleteOutlined /> Delete Story
        </Button>
      </Popconfirm>
    </div>
  );
};

export default StoryManagementComponent;