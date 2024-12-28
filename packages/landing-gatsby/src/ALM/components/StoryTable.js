import React, { useState, useEffect } from 'react';
import { Table, Checkbox, Dropdown, Menu, Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { generateColumns, filterColumns, handleColumnVisibilityChange } from '../utils/tableUtils';

const { Paragraph } = Typography;

const StoryTable = ({ stories, selectedStories, onStoryCheckboxChange, onDeleteStory }) => {
  const [visibleColumns, setVisibleColumns] = useState([]);

  useEffect(() => {
    if (stories?.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(Object.keys(stories[0]));
    }
  }, [stories, visibleColumns]);

  const handleColumnToggle = (column) => {
    setVisibleColumns((prevColumns) =>
      handleColumnVisibilityChange(generateColumns(stories), prevColumns, column, !prevColumns.includes(column))
    );
  };

  const allColumns = generateColumns(stories);
  const dynamicColumns = filterColumns(allColumns, visibleColumns).map((column) => {
    if (column.key === 'data' || column.key === 'description') { // Assuming 'data' or 'description' are columns with long text
      return {
        ...column,
        render: (text) => {
          if (typeof text === 'object') {
            // Convert object to string or choose a specific property to display
            return (
              <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'Read More' }}>
                {JSON.stringify(text)}
              </Paragraph>
            );
          }
          return (
            <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'Read More' }}>
              {text}
            </Paragraph>
          );
        },
      };
    }
    return column;
  });

  const deleteColumn = {
    title: 'Actions',
    key: 'delete',
    render: (_, story) => (
      <DeleteOutlined
        style={{ color: 'red', cursor: 'pointer' }}
        onClick={() => {
          console.log(`Delete icon clicked for story ID: ${story.id}`); // Debug log
          onDeleteStory(story.id);
        }}
      />
    ),
  };

  const primaryColumn = {
    title: (
      <Dropdown
        menu={
          <Menu>
            {allColumns.map((column) => (
              <Menu.Item key={column.key}>
                <Checkbox
                  checked={visibleColumns.includes(column.key)}
                  onChange={() => handleColumnToggle(column.key)}
                >
                  {column.title}
                </Checkbox>
              </Menu.Item>
            ))}
          </Menu>
        }
        trigger={['click']}
      >
        <Button>+/- Columns</Button>
      </Dropdown>
    ),
    key: 'primary',
    render: (_, story) => (
      <Checkbox
        checked={selectedStories.includes(story.id)}
        onChange={(e) => onStoryCheckboxChange(story.id, e.target.checked)}
      />
    ),
  };

  return (
    <Table
      columns={[primaryColumn, deleteColumn, ...dynamicColumns]}
      dataSource={stories}
      rowKey="id"
      pagination={false}
    />
  );
};

export default StoryTable;