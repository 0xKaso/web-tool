import { useState } from "react";

export default function Page() {
  const [logs, setLogs] = useState<any[]>([]);

  const pushLog = (log: string) => {
    setLogs((logs) => [...logs, log]);
  };

  return { logs, pushLog };
}
