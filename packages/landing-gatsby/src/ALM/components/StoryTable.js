import React, { useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import StoryManagementComponent from "./StoryManagementComponent";
import { useDeleteStoriesMutation } from "../store/api";

const StoryTable = ({ stories: initialStories, feedId }) => {
  const [stories, setStories] = useState(initialStories);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [deleteStories] = useDeleteStoriesMutation();

  const handleStoryUpdated = (updatedStory, deletedStoryId) => {
    setStories((prevStories) => {
      if (deletedStoryId) {
        return prevStories.filter((story) => story.id !== deletedStoryId);
      } else if (updatedStory) {
        return prevStories.map((story) =>
          story.id === updatedStory.id ? { ...story, ...updatedStory } : story
        );
      }
      return prevStories;
    });
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteStories({ story_ids: selectedRowKeys }).unwrap();
      message.success("Selected stories deleted successfully.");
      setStories((prevStories) =>
        prevStories.filter((story) => !selectedRowKeys.includes(story.id))
      );
      setSelectedRowKeys([]); // Clear selection
    } catch (error) {
      console.error("Error deleting selected stories:", error);
      message.error("Failed to delete selected stories. Please try again.");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: ["data", "title"],
      key: "title",
      render: (title) => <span>{title || "No Title"}</span>,
    },
    {
      title: "Published",
      dataIndex: ["data", "published"],
      key: "published",
      render: (published) => <span>{published || "No Date"}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, story) => (
        <StoryManagementComponent
          story={story}
          onStoryUpdated={handleStoryUpdated}
        />
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div>
      <h3>Stories for Feed ID: {feedId}</h3>
      <Button
        type="primary"
        danger
        onClick={handleDeleteSelected}
        disabled={!selectedRowKeys.length}
        style={{ marginBottom: 16 }}
      >
        Delete Selected
      </Button>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={stories}
        rowKey="id" // Ensure the rowKey matches the story ID
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default StoryTable;