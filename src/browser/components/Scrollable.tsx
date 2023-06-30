import { defaultsDeep } from "lodash-es";
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentProps,
} from "overlayscrollbars-react";

export type ScrollableProps = OverlayScrollbarsComponentProps;

export function Scrollable(props: ScrollableProps) {
  return (
    <OverlayScrollbarsComponent
      {...defaultsDeep({}, props, {
        defer: true,
        options: {
          scrollbars: {
            autoHide: "move",
            theme: "os-theme-gumbo",
          },
        },
      })}
    />
  );
}

export default Scrollable;
