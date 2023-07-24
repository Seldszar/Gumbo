import { useOverlayScrollbars } from "overlayscrollbars-react";
import { useRef, useEffect, ReactNode } from "react";

export interface ScrollableProps {
  children?: ReactNode;
  className?: string;
}

export function Scrollable(props: ScrollableProps) {
  const [initialize] = useOverlayScrollbars({
    defer: true,
    options: {
      scrollbars: {
        autoHide: "move",
        theme: "os-theme-gumbo",
      },
    },
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current == null) {
      return;
    }

    initialize(ref.current);
  }, [initialize]);

  return (
    <div className={props.className} ref={ref}>
      {props.children}
    </div>
  );
}

export default Scrollable;
