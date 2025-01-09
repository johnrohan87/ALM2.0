import React, { useState } from "react";
import { Table } from "antd";
import StoryManagementComponent from "./StoryManagementComponent";

const StoryTable = ({ stories: initialStories, feedId }) => {
  const [stories, setStories] = useState(initialStories);

  const handleStoryUpdated = (updatedStory, deletedStoryId) => {
    setStories((prevStories) => {
      if (deletedStoryId) {
        // Filter out the deleted story
        return prevStories.filter((story) => story.id !== deletedStoryId);
      } else if (updatedStory) {
        // Update the specific story in the state
        return prevStories.map((story) =>
          story.id === updatedStory.id
            ? { ...story, ...updatedStory }
            : story
        );
      }
      return prevStories; // No changes if neither condition is met
    });
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

  return (
    <div>
      <h3>Stories for Feed ID: {feedId}</h3>
      <Table
        columns={columns}
        dataSource={stories}
        rowKey="id" // Ensure the rowKey matches the story ID
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default StoryTable;