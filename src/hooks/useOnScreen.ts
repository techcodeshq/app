import { useEffect, useState } from "react";

export default function useOnScreen(element) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting),
    );

    observer.observe(element);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [element]);

  return isIntersecting;
}
