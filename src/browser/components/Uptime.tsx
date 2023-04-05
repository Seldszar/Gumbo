import { useMemo } from "react";

import { formatTime } from "~/browser/helpers";
import { useNow } from "~/browser/hooks";

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
    <div className={props.className} title={props.startDate.toLocaleString("en-US")}>
      {timeString}
    </div>
  );
}

export default Uptime;
