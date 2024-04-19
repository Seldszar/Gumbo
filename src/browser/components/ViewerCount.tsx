import { useMemo } from "react";

import { isRerunStream, t } from "~/common/helpers";
import { HelixStream } from "~/common/types";

import { styled } from "~/browser/styled-system/jsx";

import Tooltip from "./Tooltip";

const Wrapper = styled("div", {
  base: {
    color: { base: "red.600", _dark: "red.400" },
    display: "flex",
    fontVariantNumeric: "tabular-nums",
    gap: 1,

    "& svg": {
      fill: "none",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      stroke: "current",
      strokeWidth: "2px",
      w: 5,
    },
  },

  variants: {
    isRerun: {
      true: {
        color: { base: "neutral.600", _dark: "neutral.400" },
      },
    },
  },
  defaultVariants: {
    isRerun: false,
  },
});

export interface ViewerCountProps {
  stream: HelixStream;

  className?: string;
}

function ViewerCount(props: ViewerCountProps) {
  const { stream } = props;

  const isRerun = useMemo(() => isRerunStream(stream), [stream.tags]);
  const status = useMemo(() => {
    if (isRerun) {
      return {
        title: t("titleText_rerun"),
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M17.68,17.73a8,8,0,1,1,1.8-8.65m.5-5v5H15" />
          </svg>
        ),
      };
    }

    return {
      title: t("titleText_live"),
      icon: (
        <svg viewBox="0 0 24 24">
          <line x1="12" y1="12" x2="12" y2="12.01" />
          <path d="M14.828 9.172a4 4 0 0 1 0 5.656" />
          <path d="M17.657 6.343a8 8 0 0 1 0 11.314" />
          <path d="M9.168 14.828a4 4 0 0 1 0 -5.656" />
          <path d="M6.337 17.657a8 8 0 0 1 0 -11.314" />
        </svg>
      ),
    };
  }, [isRerun]);

  return (
    <Tooltip content={status.title}>
      <Wrapper isRerun={isRerun} className={props.className}>
        {stream.viewerCount.toLocaleString("en-US")}
        {status.icon}
      </Wrapper>
    </Tooltip>
  );
}

export default ViewerCount;
