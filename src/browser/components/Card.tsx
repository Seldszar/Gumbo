import { ReactNode } from "react";
import tw, { styled } from "twin.macro";

const Ornament = styled.div`
  ${tw`flex-none`}
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

const Wrapper = styled.div`
  ${tw`flex gap-4 items-center px-4 hover:(bg-neutral-200 dark:bg-neutral-800)`}
`;

export interface CardProps {
  children?: ReactNode;
  className?: string;

  title?: ReactNode;
  subtitle?: ReactNode;

  leftOrnament?: ReactNode;
  rightOrnament?: ReactNode;
}

function Card(props: CardProps) {
  return (
    <Wrapper className={props.className}>
      {props.leftOrnament && <Ornament>{props.leftOrnament}</Ornament>}

      <Inner>
        {props.title && <Title>{props.title}</Title>}
        {props.subtitle && <Subtitle>{props.subtitle}</Subtitle>}

        <Body>{props.children}</Body>
      </Inner>

      {props.rightOrnament && <Ornament>{props.rightOrnament}</Ornament>}
    </Wrapper>
  );
}

export default Card;
