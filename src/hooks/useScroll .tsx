'use client'
import { useCallback, useEffect, useRef } from "react";

interface ScrollParams {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const useScroll = ({ loading, hasMore, onLoadMore }: ScrollParams) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (!loading && hasMore) {
          onLoadMore();
        }
      }
    }
  }, [loading, hasMore, onLoadMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return containerRef;
};

export default useScroll;
