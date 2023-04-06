import { PropsOf } from "@emotion/react";
import { IconDotsVertical } from "@tabler/icons-react";
import { HTMLAttributes, ReactNode, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { MenuProps } from "./Menu";

import ContextMenu from "./ContextMenu";

const Aside = styled.div`
  ${tw`flex-none ltr:mr-4 rtl:ml-4`}
`;

const Inner = styled.div`
  ${tw`flex-1 overflow-hidden`}
`;

const Title = styled.div`
  ${tw`font-medium truncate`}
`;

const Subtitle = styled.div`
  ${tw`text-neutral-600 dark:text-neutral-400 text-sm truncate`}
`;

const Body = styled.div`
  ${tw`text-neutral-600 dark:text-neutral-400 text-sm`}
`;

const ActionButton = styled.button`
  ${tw`p-1 rounded transition text-neutral-600 hover:text-black dark:(text-neutral-400 hover:text-white)`}
`;

const ActionList = styled.div`
  ${tw`hidden flex-none gap-1 items-center ltr:(-mr-1 pl-3) rtl:(-ml-1 pr-3)`}
`;

const Wrapper = styled.div`
  ${tw`flex items-center px-4 hover:(bg-neutral-200 dark:bg-neutral-800)`}

  :hover ${ActionList} {
    ${tw`flex`}
  }
`;

export interface CardProps {
  titleProps?: PropsOf<typeof Title>;
  subtitleProps?: PropsOf<typeof Subtitle>;
  aside?: ReactNode;
  children?: ReactNode;
  actionButtons?: HTMLAttributes<HTMLButtonElement>[];
  overflowMenu?: MenuProps;
  className?: string;
}

function Card(props: CardProps) {
  const actionList = useMemo(() => {
    const result =
      props.actionButtons?.map((props, index) => <ActionButton key={index} {...props} />) ?? [];

    if (props.overflowMenu) {
      result.push(
        <ContextMenu placement="bottom-end" menu={props.overflowMenu}>
          {(ref) => (
            <ActionButton ref={ref}>
              <IconDotsVertical size="1.25rem" />
            </ActionButton>
          )}
        </ContextMenu>
      );
    }

    if (result.length === 0) {
      return null;
    }

    return <ActionList>{result}</ActionList>;
  }, [props.actionButtons, props.overflowMenu]);

  return (
    <Wrapper className={props.className}>
      {props.aside && <Aside>{props.aside}</Aside>}

      <Inner>
        <Title {...props.titleProps} />
        <Subtitle {...props.subtitleProps} />
        <Body>{props.children}</Body>
      </Inner>

      {actionList}
    </Wrapper>
  );
}

export default Card;
