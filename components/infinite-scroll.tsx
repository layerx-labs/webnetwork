import { ReactNode, useEffect, useRef } from "react";
interface InfiniteScrollProps {
  handleNewPage: () => void;
  isLoading: boolean;
  hasMore: boolean;
  children: ReactNode | ReactNode[];
}

export default function InfiniteScroll({
  handleNewPage,
  hasMore,
  isLoading,
  children
}: InfiniteScrollProps) {
  const divRef = useRef(null);

  function handleScrolling(entries, observer) {
    if (!hasMore || isLoading) return;

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        handleNewPage();

        observer.disconnect();
      }
    });
  }

  const observer = new IntersectionObserver(handleScrolling, {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
  });

  useEffect(() => {
    const lastChild = divRef.current?.lastChild

    if (lastChild) observer.observe(lastChild);

    return () => {
      if (lastChild) observer.unobserve(lastChild);
    };
  }, [hasMore, isLoading, children]);

  return <div id="infinite-scroll" ref={divRef}>{children}</div>;
}
