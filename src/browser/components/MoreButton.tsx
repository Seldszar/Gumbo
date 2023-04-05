import { ReactNode } from "react";

import Button from "./Button";

export interface MoreButtonProps {
  children?: ReactNode;
  isLoading: boolean;
  fetchMore(): void;
}

function MoreButton(props: MoreButtonProps) {
  return (
    <Button
      fullWidth
      isLoading={props.isLoading}
      onViewportEnter={() => props.fetchMore()}
      onClick={() => props.fetchMore()}
    >
      {props.children}
    </Button>
  );
}

export default MoreButton;
