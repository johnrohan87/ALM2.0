import React from 'react';
import { Modal, List } from 'antd';

const DialogBox = ({ isVisible, onConfirm, onCancel, deleteTarget }) => {
  return (
    <Modal
      title="Confirm Deletion"
      open={isVisible}
      onOk={onConfirm} // Call the confirm action
      onCancel={onCancel} // Call the cancel action
    >
      {deleteTarget.stories.length > 0 ? (
        <>
          <p>Are you sure you want to delete the following stories?</p>
          <List
            dataSource={deleteTarget.stories}
            renderItem={(storyId) => <List.Item key={storyId}>Story ID: {storyId}</List.Item>}
          />
        </>
      ) : (
        <p>Are you sure you want to delete the entire feed and all associated stories?</p>
      )}
    </Modal>
  );
};

export default DialogBox;