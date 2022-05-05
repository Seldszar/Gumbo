import React, { FC, ReactNode } from "react";

import Button from "./Button";

export interface MoreButtonProps {
  children?: ReactNode;
  isLoading: boolean;
  fetchMore(): void;
}

const MoreButton: FC<MoreButtonProps> = (props) => (
  <Button
    fullWidth
    isLoading={props.isLoading}
    onViewportEnter={() => props.fetchMore()}
    onClick={() => props.fetchMore()}
  >
    {props.children}
  </Button>
);

export default MoreButton;
