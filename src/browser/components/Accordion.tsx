import { IconChevronRight } from "@tabler/icons-react";
import { ReactNode } from "react";
import { useToggle } from "react-use";

import { styled } from "~/browser/styled-system/jsx";

const Icon = styled(IconChevronRight, {
  base: {
    transition: "common",
  },

  variants: {
    isOpen: {
      true: {
        rotate: "90deg",
      },
    },
  },

  defaultVariants: {
    isOpen: false,
  },
});

const Title = styled("div", {
  base: {
    flex: 1,
    fontSize: "sm",
    fontWeight: "medium",
    textTransform: "uppercase",
    truncate: true,
  },
});

const HeaderInner = styled("div", {
  base: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    flex: 1,
    gap: 1,

    _groupHover: {
      color: { base: "black", _dark: "white" },
    },
  },
});

const HeaderAside = styled("div", {
  base: {
    flex: "none",
    visibility: { base: "hidden", _groupHover: "visible" },
  },
});

const Header = styled("div", {
  base: {
    alignItems: "center",
    color: { base: "neutral.600", _dark: "neutral.400" },
    display: "flex",
    gap: 1,
    px: 4,
    py: 2,
  },
});

export interface AccordionProps {
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
  title: string;
}

function Accordion(props: AccordionProps) {
  const [isOpen, toggleOpen] = useToggle(true);

  return (
    <div className={props.className}>
      <Header className="group">
        <HeaderInner onClick={() => toggleOpen()}>
          <Icon size="1rem" isOpen={isOpen} />
          <Title>{props.title}</Title>
        </HeaderInner>

        {props.aside && <HeaderAside>{props.aside}</HeaderAside>}
      </Header>

      {isOpen && <div>{props.children}</div>}
    </div>
  );
}

export default Accordion;
