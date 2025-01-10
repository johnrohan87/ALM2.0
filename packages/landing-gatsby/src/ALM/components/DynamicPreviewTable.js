import React, { useState } from "react";
import { Table, Button, Dropdown, Menu, Checkbox } from "antd";
import "./DynamicPreviewTable.css";

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
  const [visibleFields, setVisibleFields] = useState(metadata.fields); // Default all fields visible

  const handleFieldToggle = (field) => {
    setVisibleFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const menu = (
    <Menu>
      {metadata.fields.map((field) => (
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

  const columns = metadata.fields
    .filter((field) => visibleFields.includes(field))
    .map((field) => ({
      title: field.charAt(0).toUpperCase() + field.slice(1),
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

  const normalizedStories = stories.map((story, index) => ({
    key: index,
    ...story,
  }));

  return (
    <div className="dynamic-preview-table-container">
      <h2>{metadata.title}</h2>
      <p>{metadata.description}</p>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button style={{ marginBottom: 16 }}>Customize Fields</Button>
      </Dropdown>
      <Table
        dataSource={normalizedStories}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowClassName={() => "dynamic-row"}
      />
    </div>
  );
};

export default DynamicPreviewTable;