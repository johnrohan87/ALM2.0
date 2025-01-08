import React, { useState } from "react";
import { Table, Button } from "antd";
import "./DynamicPreviewTable.css"; // Import custom styles

// New component to handle expandable text
const ExpandableText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const isLongText = text.length > 100;

  if (!isLongText) {
    return <span>{text}</span>;
  }

  return (
    <div>
      <span>{expanded ? text : `${text.slice(0, 100)}...`}</span>
      <Button
        type="link"
        onClick={() => setExpanded(!expanded)}
        style={{ paddingLeft: 5 }}
      >
        {expanded ? "Show Less" : "Read More"}
      </Button>
    </div>
  );
};

const DynamicPreviewTable = ({ previewData }) => {
  const { metadata, stories } = previewData;

  // Generate columns dynamically based on `fields` from metadata
  const columns = metadata.fields.map((field) => ({
    title: field.charAt(0).toUpperCase() + field.slice(1), // Capitalize column titles
    dataIndex: field,
    key: field,
    render: (value) => {
      if (!value) return <span>N/A</span>;
      if (typeof value === "string") return <ExpandableText text={value} />;
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
        return JSON.stringify(value);
      }
      return <span>{value}</span>;
    },
  }));

  // Normalize stories to ensure `key` exists for Ant Design
  const normalizedStories = stories.map((story, index) => ({
    key: index, // Use index as a fallback key
    ...story,
  }));

  return (
    <div className="dynamic-preview-table-container">
      <h2>{metadata.title}</h2>
      <p>{metadata.description}</p>
      <Table
        dataSource={normalizedStories}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowClassName={() => "dynamic-row"} // Apply custom row styling
      />
    </div>
  );
};

export default DynamicPreviewTable;