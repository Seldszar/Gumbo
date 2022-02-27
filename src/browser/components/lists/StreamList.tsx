import React, { FC } from "react";
import { styled } from "twin.macro";

import StreamCard from "../cards/StreamCard";

const Wrapper = styled.div``;

export interface StreamListProps {
  className?: string;
  streams: any[];
}

const StreamList: FC<StreamListProps> = (props) => (
  <Wrapper className={props.className}>
    {props.streams.map((stream) => (
      <StreamCard key={stream.id} stream={stream} />
    ))}
  </Wrapper>
);

export default StreamList;
