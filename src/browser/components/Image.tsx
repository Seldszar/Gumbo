import { useState } from "react";
import tw, { styled } from "twin.macro";

const Wrapper = styled.div`
  ${tw`overflow-hidden relative [&_img]:(absolute h-full inset-0 object-center object-cover transition-opacity w-full)`}
`;

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
