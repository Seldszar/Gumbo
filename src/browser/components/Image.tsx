import { useState } from "react";

import { styled } from "~/browser/styled-system/jsx";

const Wrapper = styled("div", {
  base: {
    overflow: "hidden",
    pos: "relative",

    "& img": {
      h: "full",
      inset: 0,
      objectFit: "cover",
      objectPosition: "center",
      pos: "absolute",
      transition: "opacity",
      w: "full",
    },
  },
});

export interface ImageProps {
  className?: string;
  ratio?: number;
  src: string;
}

function Image(props: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  const style = {
    paddingTop: props.ratio && `${props.ratio * 100}%`,
  };

  return (
    <Wrapper className={props.className} style={style}>
      <img onLoad={() => setLoaded(true)} style={{ opacity: Number(loaded) }} src={props.src} />
    </Wrapper>
  );
}

export default Image;
