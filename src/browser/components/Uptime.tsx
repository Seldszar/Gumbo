import { useMemo } from "react";

import { formatTime } from "~/browser/helpers";
import { useNow } from "~/browser/hooks";

import Tooltip from "./Tooltip";

export interface UptimeProps {
  className?: string;
  startDate: Date;
}

function Uptime(props: UptimeProps) {
  const now = useNow();

  const timeString = useMemo(
    () => formatTime(now.getTime() - props.startDate.getTime()),
    [props.startDate, now]
  );

  return (
    <div className={props.className}>
      <Tooltip content={props.startDate.toLocaleString("en-US")}>
        <span>{timeString}</span>
      </Tooltip>
    </div>
  );
}

export default Uptime;
