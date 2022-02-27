import "twin.macro";

import { css as cssImport } from "@emotion/react";
import { CSSInterpolation } from "@emotion/serialize";
import styledImport from "@emotion/styled";

declare module "twin.macro" {
  const css: typeof cssImport;
  const styled: typeof styledImport;
}

declare module "react" {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSInterpolation;
  }

  interface SVGProps<T> extends SVGProps<T> {
    css?: CSSInterpolation;
  }
}
