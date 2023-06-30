import { defaultsDeep } from "lodash-es";
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentProps,
} from "overlayscrollbars-react";

export type ScrollableProps = OverlayScrollbarsComponentProps;

export function Scrollable(props: ScrollableProps) {
  props = defaultsDeep({}, props, {
    defer: true,
    options: {
      scrollbars: {
        autoHide: "move",
        theme: "os-theme-gumbo",
      },
    },
  });

  return <OverlayScrollbarsComponent {...props} />;
}

export default Scrollable;
