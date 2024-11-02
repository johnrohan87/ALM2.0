import React from 'react';
import { Modal, Button } from 'antd';

const DialogBox = ({ isVisible, onConfirm, onCancel, deleteTarget, isLoading, message }) => {
  const { feedId, stories } = deleteTarget;

  return (
    <Modal
      title="Delete Confirmation"
      visible={isVisible}
      onOk={onConfirm}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" danger onClick={onConfirm} loading={isLoading}>
          Confirm Deletion
        </Button>,
      ]}
    >
      {feedId && stories.length > 0 && (
        <p>Are you sure you want to delete feed (Feed ID: {feedId})? This will also delete the following associated stories: {stories.join(', ')}.</p>
      )}
      {feedId && stories.length === 0 && (
        <p>Are you sure you want to delete feed (Feed ID: {feedId})? This action cannot be undone.</p>
      )}
      {!feedId && stories.length > 0 && (
        <p>Are you sure you want to delete the following stor{stories.length > 1 ? 'ies' : 'y'}: {stories.join(', ')}? This action cannot be undone.</p>
      )}
    </Modal>
  );
};

export default DialogBox;