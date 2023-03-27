import { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";
import { FollowedStream, HelixStream } from "~/common/types";

interface WrapperProps {
  type: string;
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`flex gap-1 text-red-600 dark:text-red-400`}

  font-feature-settings: "tnum";

  svg {
    ${tw`stroke-current w-5`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }

  ${(props) => props.type === "rerun" && tw`text-neutral-600 dark:text-neutral-400`}
`;

export interface ViewerCountProps {
  className?: string;
  stream: FollowedStream | HelixStream;
}

const ViewerCount: FC<ViewerCountProps> = (props) => {
  const { stream } = props;

  const status = useMemo(() => {
    if (stream.type === "rerun") {
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
  }, [stream.type]);

  return (
    <Wrapper type={stream.type} title={status.title} className={props.className}>
      {stream.viewerCount.toLocaleString("en-US")}
      {status.icon}
    </Wrapper>
  );
};

export default ViewerCount;
