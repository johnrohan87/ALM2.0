import { useDeleteFeedMutation, useDeleteStoriesMutation } from '../store/api';
import { message } from 'antd';

const useDeletionHandler = (refetchFeeds) => {
  const [deleteFeed] = useDeleteFeedMutation();
  const [deleteStories] = useDeleteStoriesMutation();

  const deleteFeedAndSync = async (feedId) => {
    try {
      await deleteFeed({ feed_id: feedId }).unwrap();
      message.success(`Feed (ID: ${feedId}) deleted successfully.`);
      if (refetchFeeds) {
        const updatedFeeds = await refetchFeeds();
        console.log("Feeds after deletion:", updatedFeeds?.data?.feeds);
      }
    } catch (error) {
      console.error("Error deleting feed:", error);
      message.error("Failed to delete feed. Please try again.");
    }
  };

  const deleteStoriesAndSync = async (storyIds) => {
    try {
      await deleteStories({ story_ids: storyIds }).unwrap();
      message.success("Stories deleted successfully.");
      if (refetchFeeds) {
        const updatedFeeds = await refetchFeeds();
        console.log("Stories after deletion synced:", updatedFeeds?.data?.feeds);
      }
    } catch (error) {
      console.error("Error deleting stories:", error);
      message.error("Failed to delete stories. Please try again.");
    }
  };

  return { deleteFeedAndSync, deleteStoriesAndSync };
};

export default useDeletionHandler;