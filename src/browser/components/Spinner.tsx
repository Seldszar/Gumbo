import { styled } from "~/browser/styled-system/jsx";

const Wrapper = styled("div", {
  base: {
    animation: "spin",
    aspectRatio: "square",
    borderColor: "purple.500",
    borderLeftColor: "transparent",
    borderWidth: 3,
    rounded: "full",
  },
});

export interface SpinnerProps {
  className?: string;
}

function Spinner(props: SpinnerProps) {
  return <Wrapper {...props} />;
}

export default Spinner;
