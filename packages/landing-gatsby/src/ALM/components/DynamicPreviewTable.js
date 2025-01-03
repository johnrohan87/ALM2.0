import React from "react";
import { Table } from "antd";

const DynamicPreviewTable = ({ previewData }) => {
  const { metadata, stories } = previewData;

  // Generate columns dynamically based on `fields` from metadata
  const columns = metadata.fields.map((field) => ({
    title: field.charAt(0).toUpperCase() + field.slice(1), // Capitalize column titles
    dataIndex: field,
    key: field,
    render: (value) => {
      // Handle nested objects and arrays
      if (Array.isArray(value)) {
        return value.map((item, index) =>
          typeof item === "object" ? (
            <span key={index}>{JSON.stringify(item)}</span>
          ) : (
            <span key={index}>{item}</span>
          )
        );
      }
      if (typeof value === "object" && value !== null) {
        return JSON.stringify(value);
      }
      return <span>{value || "N/A"}</span>;
    },
  }));

  // Normalize stories to ensure `key` exists for Ant Design
  const normalizedStories = stories.map((story, index) => ({
    key: index, // Use index as a fallback key
    ...story,
  }));

  return (
    <div>
      <h2>{metadata.title}</h2>
      <p>{metadata.description}</p>
      <Table
        dataSource={normalizedStories}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default DynamicPreviewTable;