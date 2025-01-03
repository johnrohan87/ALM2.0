import { useDeleteFeedMutation, useDeleteStoriesMutation } from '../store/api';
import { message } from 'antd';

const useDeletionHandler = () => {
  const [deleteFeed] = useDeleteFeedMutation();
  const [deleteStories] = useDeleteStoriesMutation();

  const deleteFeedAndSync = async (feedId, refetchFeeds) => {
    try {
      await deleteFeed({ feed_id: feedId }).unwrap();
      message.success(`Feed (ID: ${feedId}) deleted successfully.`);
      if (refetchFeeds) await refetchFeeds();
    } catch (error) {
      console.error("Error deleting feed:", error);
      message.error("Failed to delete feed.");
    }
  };

  const deleteStoriesAndSync = async (storyIds, refetchFeeds) => {
    try {
      await deleteStories({ story_ids: storyIds }).unwrap();
      message.success("Stories deleted successfully.");
      if (refetchFeeds) await refetchFeeds();
    } catch (error) {
      console.error("Error deleting stories:", error);
      message.error("Failed to delete stories.");
    }
  };

  return { deleteFeedAndSync, deleteStoriesAndSync };
};

export default useDeletionHandler;