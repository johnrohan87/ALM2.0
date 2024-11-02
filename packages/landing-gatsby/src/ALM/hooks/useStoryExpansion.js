import { useState, useCallback } from 'react';
import { useLazyFetchUserStoriesQuery } from '../store/api';

export const useStoryExpansion = () => {
  const [expandedFeedStories, setExpandedFeedStories] = useState({});
  const [triggerFetchStories, { isFetching }] = useLazyFetchUserStoriesQuery();

  const handleExpand = useCallback(
    async (expanded, feed) => {
      if (expanded && !expandedFeedStories[feed.id]) {
        try {
          const result = await triggerFetchStories({ feedId: feed.id }).unwrap();
          setExpandedFeedStories((prev) => ({
            ...prev,
            [feed.id]: result.stories || [],
          }));
        } catch (error) {
          console.error('Error fetching stories:', error);
        }
      }
    },
    [expandedFeedStories, triggerFetchStories]
  );

  return {
    expandedFeedStories,
    handleExpand,
    isFetching,
  };
};