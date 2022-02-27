import React, { FC, useMemo } from "react";

import { useNow } from "../helpers/hooks";
import { formatTime } from "../helpers/time";

export interface UptimeProps {
  className?: string;
  startDate: Date;
}

const Uptime: FC<UptimeProps> = (props) => {
  const now = useNow();

  const timeString = useMemo(
    () => formatTime(now.getTime() - props.startDate.getTime(), false),
    [props.startDate, now]
  );

  return (
    <div className={props.className} title={props.startDate.toLocaleString("en-US")}>
      {timeString}
    </div>
  );
};

export default Uptime;
