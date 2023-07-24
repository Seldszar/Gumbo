export interface RendererProps {
  className?: string;
  content: string;
}

function Renderer(props: RendererProps) {
  return <div className={props.className} dangerouslySetInnerHTML={{ __html: props.content }} />;
}

export default Renderer;
