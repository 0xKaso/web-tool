import { useState } from "react";
import { saveAs } from "file-saver";

export default function Page() {
  const [logs, setLogs] = useState<any[]>([]);

  const pushLog = (log: string) => {
    const date = new Date();
    setLogs((logs) => [...logs, `[${date.toLocaleString()}]:${log}`]);
  };

  const clearLogs = () => {
    setLogs([]);
    pushLog("日志已清空");
  };

  const downloadLogs = () => {
    var blob = new Blob([JSON.stringify(logs)], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "logs.txt");
  };

  return { logs, pushLog, clearLogs, downloadLogs };
}
