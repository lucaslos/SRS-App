import React, { useEffect, useLayoutEffect } from 'react';
import { notMatchesOneOf } from '@utils/checkIf';
import { anyFunction } from '@utils/typings';
import { usePrevious } from '@utils/hooks/usePrevious';
import { useThrottledCallback } from '@utils/hooks/useThrottle';

export function useInfiniteLoading({
  loadMore,
  hasMore,
  fetchStatus,
  scrollContainerRef,
}: {
  loadMore: anyFunction;
  hasMore: boolean;
  scrollContainerRef: React.RefObject<HTMLElement>;
  fetchStatus:
    | 'idle'
    | 'stale'
    | 'loading'
    | 'loadingError'
    | 'refreshing'
    | 'refreshingError'
    | 'success'
    | 'loadingMore'
    | 'loadingMoreError';
}) {
  useEffect(() => {
    // if has more and has y space available to load more
    if (fetchStatus === 'success' && hasMore) {
      const container = scrollContainerRef.current;

      if (container && container.scrollHeight <= container.clientHeight) {
        loadMore();
      }
    }
  }, [fetchStatus]);

  const lastStatus = usePrevious(fetchStatus);
  useLayoutEffect(() => {
    if (fetchStatus === 'success' && lastStatus === 'loading') {
      scrollContainerRef.current?.scrollTo({ top: 0 });
    }
  }, [fetchStatus]);

  const onScroll = useThrottledCallback(() => {
    if (
      hasMore &&
      notMatchesOneOf(fetchStatus, ['loading', 'loadingMore', 'refreshing'])
    ) {
      const element = scrollContainerRef.current;

      if (
        element &&
        Math.floor(element.scrollHeight - element.scrollTop) <=
          element.clientHeight
      ) {
        loadMore();
      }
    }
  }, 500);

  return onScroll;
}
