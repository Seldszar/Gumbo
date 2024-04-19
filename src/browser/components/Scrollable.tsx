// import * as ScrollArea from "@radix-ui/react-scroll-area";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { ReactNode } from "react";

export interface ScrollableProps {
  children?: ReactNode;
  className?: string;
}

export function Scrollable(props: ScrollableProps) {
  // return (
  //   <ScrollArea.Root className="grid overflow-hidden">
  //     <ScrollArea.Viewport asChild>{props.children}</ScrollArea.Viewport>

  //     <ScrollArea.Scrollbar className="bg-black/50 flex p-px w-1.5">
  //       <ScrollArea.Thumb className="bg-purple-500 flex-1 rounded-full" />
  //     </ScrollArea.Scrollbar>
  //   </ScrollArea.Root>
  // );

  return (
    <OverlayScrollbarsComponent
      options={{
        scrollbars: {
          theme: "os-theme-gumbo",
        },
      }}
      {...props}
    />
  );
}

export default Scrollable;
