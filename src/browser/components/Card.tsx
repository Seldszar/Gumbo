import React, { FC, HTMLAttributes, useMemo } from "react";
import tw, { styled, theme } from "twin.macro";

import { MenuProps } from "./Menu";

import Anchor from "./Anchor";
import ContextMenu from "./ContextMenu";

const ActionButton = styled.button`
  ${tw`mr-1 last:mr-0 p-1 pointer-events-auto rounded transition text-neutral-400 hover:text-white`}

  svg {
    ${tw`flex-none stroke-current w-5`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }
`;

const ActionMenu = styled.button`
  ${tw`absolute pointer-events-none invisible inset-y-0 pl-12 pr-3 right-0`}

  background-image: linear-gradient(to right, transparent, rgba(38, 38, 38, 0.75) ${theme<string>(
    "spacing.9"
  )});
`;

const Wrapper = styled(Anchor)`
  ${tw`relative hover:bg-neutral-800`}

  &:hover ${ActionMenu} {
    ${tw`visible`}
  }
`;

export interface CardProps {
  className?: string;
  actionButtons?: HTMLAttributes<HTMLButtonElement>[];
  ellipsisMenu?: MenuProps;
  to: string;
}

const Card: FC<CardProps> = (props) => {
  const actionMenu = useMemo(() => {
    const result =
      props.actionButtons?.map((props, index) => <ActionButton key={index} {...props} />) ?? [];

    if (props.ellipsisMenu) {
      result.push(
        <ContextMenu placement="bottom-end" menu={props.ellipsisMenu}>
          {(ref) => (
            <ActionButton ref={ref}>
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
                <circle cx="12" cy="5" r="1" />
              </svg>
            </ActionButton>
          )}
        </ContextMenu>
      );
    }

    if (result.length === 0) {
      return null;
    }

    return <ActionMenu>{result}</ActionMenu>;
  }, [props.actionButtons, props.ellipsisMenu]);

  return (
    <Wrapper target="_blank" href={props.to} className={props.className}>
      {props.children}
      {actionMenu}
    </Wrapper>
  );
};

export default Card;
