import { useCallback, useRef, useState } from "react";

export default function useOnScreen(deps: any[] = []) {
  const [visible, setVisible] = useState(false);
  const observer = useRef<IntersectionObserver>(null);

  const ref = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      async (entries) => {
        setVisible(entries[0].isIntersecting);
      },
      { threshold: 0.0 },
    );
    if (node) observer.current.observe(node);
  }, deps);

  return { ref, visible };
}
