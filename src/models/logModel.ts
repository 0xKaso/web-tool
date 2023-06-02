import { useState } from "react";

export default function Page() {
  const [logs, setLogs] = useState<any[]>([]);

  const pushLog = (log: string) => {
    const date = new Date();
    setLogs((logs) => [...logs, `[${date.toLocaleString()}]:${log}`]);
  };

  return { logs, pushLog };
}
