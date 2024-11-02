import React from 'react';
import { Input, Table, Spin } from 'antd';

const PreviewFeed = ({ url, onPreviewFeed, previewData, isFetchingPreview }) => {
  // Define the columns for the preview table
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Published',
      dataIndex: 'published',
      key: 'published',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      render: (link) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      ),
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Enter feed URL"
        enterButton="Preview"
        value={url}
        onChange={onPreviewFeed}
        style={{ marginBottom: 20 }}
      />

      {isFetchingPreview ? (
        <Spin size="large" style={{ marginBottom: 20 }} />
      ) : (
        previewData?.stories && <Table columns={columns} dataSource={previewData.stories} rowKey="link" />
      )}
    </div>
  );
};

export default PreviewFeed;