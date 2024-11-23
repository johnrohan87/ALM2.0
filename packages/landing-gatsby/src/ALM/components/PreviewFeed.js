import React from 'react';
import { Input, Table, Spin, Button } from 'antd';

const PreviewFeed = ({ url, onPreviewFeed, previewData, isFetchingPreview, onAddStoryToUserFeed }) => {
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
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        if (previewData && previewData.feed) {
          return (
            <Button type="link" onClick={() => onAddStoryToUserFeed(record, previewData.feed)}>
              Add to My Feed
            </Button>
          );
        } else {
          return (
            <Button type="link" disabled>
              Feed Data Missing
            </Button>
          );
        }
      },
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
        previewData?.stories && (
          <Table columns={columns} dataSource={previewData.stories} rowKey="link" />
        )
      )}
    </div>
  );
};

export default PreviewFeed;