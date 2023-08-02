import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { ReactNode } from "react";

export interface ScrollableProps {
  children?: ReactNode;
  className?: string;
}

export function Scrollable(props: ScrollableProps) {
  return (
    <OverlayScrollbarsComponent
      options={{
        scrollbars: {
          autoHide: "leave",
          theme: "os-theme-gumbo",
        },
      }}
      {...props}
    />
  );
}

export default Scrollable;
