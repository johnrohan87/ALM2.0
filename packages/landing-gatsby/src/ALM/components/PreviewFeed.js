import React from 'react';
import { Table, Input } from 'antd';

const PreviewFeed = ({ url, onPreviewFeed, previewData, isFetchingPreview }) => {
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
    <>
      <Input.Search
        placeholder="Enter feed URL"
        enterButton="Preview"
        value={url}
        onChange={onPreviewFeed}
        onSearch={() => onPreviewFeed(url)}
      />
      {isFetchingPreview ? (
        <p>Loading preview...</p>
      ) : (
        previewData?.stories && <Table columns={columns} dataSource={previewData.stories} rowKey="link" />
      )}
    </>
  );
};

export default PreviewFeed;