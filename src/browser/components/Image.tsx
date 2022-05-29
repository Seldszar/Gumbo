import { m } from "framer-motion";
import React, { FC, useState } from "react";
import tw, { styled } from "twin.macro";

interface WrapperProps {
  ratio?: number;
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`relative`}

  padding-top: ${(props) => props.ratio && `${props.ratio * 100}%`};

  img {
    ${tw`absolute h-full inset-0 object-center object-cover w-full`}
  }
`;

export interface ImageProps {
  className?: string;
  ratio?: number;
  src: string;
}

const Image: FC<ImageProps> = (props) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Wrapper className={props.className} ratio={props.ratio}>
      <m.img
        initial={false}
        onLoad={() => setLoaded(true)}
        animate={{ opacity: loaded ? 1 : 0 }}
        src={props.src}
      />
    </Wrapper>
  );
};

export default Image;
