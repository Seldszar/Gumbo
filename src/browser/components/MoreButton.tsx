import { ReactNode, useEffect, useRef } from "react";
import { useIntersection } from "react-use";

import Button from "./Button";

export interface MoreButtonProps {
  children?: ReactNode;
  isLoading: boolean;
  fetchMore(): void;
}

function MoreButton(props: MoreButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const intersection = useIntersection(ref, {
    threshold: 1,
  });

  useEffect(() => {
    if (!intersection?.isIntersecting) {
      return;
    }

    props.fetchMore();
  }, [intersection?.isIntersecting]);

  return (
    <Button fullWidth ref={ref} isLoading={props.isLoading} onClick={() => props.fetchMore()}>
      {props.children}
    </Button>
  );
}

export default MoreButton;
