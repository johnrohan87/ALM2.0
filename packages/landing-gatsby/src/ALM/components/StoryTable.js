import React, { useState, useEffect } from "react";
import { Table, Button, message, Spin, Dropdown, Menu, Checkbox } from "antd";
import StoryManagementComponent from "./StoryManagementComponent";
import { useLazyFetchUserStoriesQuery, useDeleteStoriesMutation } from "../store/api";

const StoryTable = ({ feedId }) => {
  const [stories, setStories] = useState([]);
  const [visibleFields, setVisibleFields] = useState([]); // Dynamically populate fields
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [fetchStories, { isFetching }] = useLazyFetchUserStoriesQuery();
  const [deleteStories] = useDeleteStoriesMutation();

  // Fetch stories with pagination
  const fetchPaginatedStories = async (page, pageSize) => {
    try {
      const response = await fetchStories({ feedId, page, limit: pageSize }).unwrap();

      // Default fields to display in order
      const defaultFields = ["title", "published", "link"];

      // Extract unique fields from the first story's `data` object dynamically
      const dynamicFields = response.stories.length
        ? Object.keys(response.stories[0].data).filter(
            (field) => !defaultFields.includes(field) // Exclude default fields
          )
        : [];

      // Merge default fields and dynamic fields
      const orderedFields = [...defaultFields, ...dynamicFields];

      setVisibleFields(orderedFields);

      setStories(response.stories);
      setPagination({
        current: page,
        pageSize,
        total: response.pagination.total_count,
      });
    } catch (error) {
      console.error("Error fetching stories:", error);
      message.error("Failed to fetch stories. Please try again.");
    }
  };

  useEffect(() => {
    if (feedId) {
      fetchPaginatedStories(pagination.current, pagination.pageSize);
    }
  }, [feedId]);

  const handleTableChange = (newPagination) => {
    const { current, pageSize } = newPagination;
    fetchPaginatedStories(current, pageSize);
  };

  const handleFieldToggle = (field) => {
    setVisibleFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const menu = (
    <Menu>
      {visibleFields.map((field) => (
        <Menu.Item key={field}>
          <Checkbox
            checked={visibleFields.includes(field)}
            onChange={() => handleFieldToggle(field)}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleDeleteSelected = async () => {
    try {
      await deleteStories({ story_ids: selectedRowKeys }).unwrap();
      message.success("Selected stories deleted successfully.");
      setStories((prevStories) =>
        prevStories.filter((story) => !selectedRowKeys.includes(story.id))
      );
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Error deleting selected stories:", error);
      message.error("Failed to delete selected stories. Please try again.");
    }
  };

  const handleStoryUpdated = (updatedStory, deletedStoryId) => {
    setStories((prevStories) => {
      // Handle story deletion
      if (deletedStoryId) {
        return prevStories.filter((story) => story.id !== deletedStoryId);
      }

      // Handle story update
      if (updatedStory && updatedStory.id) {
        return prevStories.map((s) =>
          s.id === updatedStory.id ? { ...s, ...updatedStory } : s
        );
      }

      // Return previous stories if no update or delete occurs
      return prevStories;
    });
  };

  const renderField = (value) => {
    if (!value) return <span>N/A</span>;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      return value.map((item, index) =>
        typeof item === "object" ? (
          <span key={index}>{JSON.stringify(item)}</span>
        ) : (
          <span key={index}>{item}</span>
        )
      );
    }
    if (typeof value === "object") {
      if (value.href) {
        return (
          <a href={value.href} target="_blank" rel="noopener noreferrer">
            {value.href}
          </a>
        );
      }
      return JSON.stringify(value);
    }
    return <span>{value}</span>;
  };

  const columns = visibleFields.map((field) => ({
    title: field.charAt(0).toUpperCase() + field.slice(1),
    dataIndex: ["data", field],
    key: field,
    render: renderField,
  }));

  // Add an actions column for StoryManagementComponent
  columns.push({
    title: "Actions",
    key: "actions",
    render: (_, story) => (
      <StoryManagementComponent
        story={story}
        onStoryUpdated={handleStoryUpdated}
      />
    ),
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div>
      <h3>Stories for Feed ID: {feedId}</h3>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button style={{ marginBottom: 16 }}>Customize Fields</Button>
      </Dropdown>
      <Button
        type="primary"
        danger
        onClick={handleDeleteSelected}
        disabled={!selectedRowKeys.length}
        style={{ marginBottom: 16 }}
      >
        Delete Selected
      </Button>
      <Spin spinning={isFetching}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={stories}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onChange={handleTableChange}
        />
      </Spin>
    </div>
  );
};

export default StoryTable;