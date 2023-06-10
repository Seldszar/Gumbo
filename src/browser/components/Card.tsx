import { PropsOf } from "@emotion/react";
import { IconDotsVertical } from "@tabler/icons-react";
import { ReactNode } from "react";
import tw, { styled } from "twin.macro";

import DropdownMenu, { DropdownMenuProps } from "./DropdownMenu";

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
  ${tw`flex-none gap-1 items-center ltr:(-mr-1 pl-3) rtl:(-ml-1 pr-3)`}
`;

const Wrapper = styled.div`
  ${tw`flex items-center px-4 hover:(bg-neutral-200 dark:bg-neutral-800)`}
`;

export interface CardProps {
  titleProps?: PropsOf<typeof Title>;
  subtitleProps?: PropsOf<typeof Subtitle>;
  aside?: ReactNode;
  children?: ReactNode;
  overflowMenu?: Omit<DropdownMenuProps, "children">;
  className?: string;
}

function Card(props: CardProps) {
  return (
    <Wrapper className={props.className}>
      {props.aside && <Aside>{props.aside}</Aside>}

      <Inner>
        <Title {...props.titleProps} />
        <Subtitle {...props.subtitleProps} />
        <Body>{props.children}</Body>
      </Inner>

      {props.overflowMenu && (
        <ActionList>
          <DropdownMenu {...props.overflowMenu}>
            <ActionButton>
              <IconDotsVertical size="1.25rem" />
            </ActionButton>
          </DropdownMenu>
        </ActionList>
      )}
    </Wrapper>
  );
}

export default Card;
