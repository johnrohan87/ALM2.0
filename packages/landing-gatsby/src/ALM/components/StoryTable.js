import React from 'react';
import { Table, Checkbox, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const StoryTable = ({ stories, feedId, onStoryCheckboxChange, onDeleteStory }) => {
  // Columns definition for stories
  const columns = [
    {
      title: 'Select',
      key: 'select',
      render: (_, story) => (
        <Checkbox
          onChange={(e) => onStoryCheckboxChange(story.id, e.target.checked)}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: ['data', 'title'],
      key: 'title',
      render: (title) => <span>{title || 'No Title'}</span>,
    },
    {
      title: 'Published',
      dataIndex: ['data', 'published'],
      key: 'published',
      render: (published) => <span>{published || 'No Date'}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, story) => (
        <Popconfirm
          title="Are you sure you want to delete this story?"
          onConfirm={() => onDeleteStory(story.id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h3>Stories for Feed ID: {feedId}</h3>
      <Table
        columns={columns}
        dataSource={stories}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default StoryTable;