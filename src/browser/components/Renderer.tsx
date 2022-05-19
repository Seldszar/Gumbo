import React, { FC } from "react";

export interface RendererProps {
  className?: string;
  content: string;
}

const Renderer: FC<RendererProps> = (props) => (
  <div className={props.className} dangerouslySetInnerHTML={{ __html: props.content }} />
);

export default Renderer;
