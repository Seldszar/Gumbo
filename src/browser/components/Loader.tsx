import { ReactNode, Suspense } from "react";

import Splash from "./Splash";

interface LoaderProps {
  children?: ReactNode;
}

function Loader(props: LoaderProps) {
  return <Suspense fallback={<Splash isLoading />}>{props.children}</Suspense>;
}

export default Loader;
