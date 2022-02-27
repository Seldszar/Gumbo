import { m, HTMLMotionProps } from "framer-motion";
import React, { FC, useState } from "react";

const Image: FC<HTMLMotionProps<"img">> = (props) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <m.img
      {...props}
      initial={false}
      onLoad={() => setLoaded(true)}
      animate={{ opacity: loaded ? 1 : 0 }}
    />
  );
};

export default Image;
