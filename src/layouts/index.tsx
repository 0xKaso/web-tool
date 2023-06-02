import { Link, Outlet, useModel } from "umi";
import styles from "./index.less";
import { useEffect, useState } from "react";

export default function Layout() {
  const { logs, clearLogs, downloadLogs } = useModel("logModel");

  const [isLogOpen, setIsLogOpen] = useState<boolean>(true);

  useEffect(() => {
    updateScrollPosition();
  }, [logs]);

  const updateScrollPosition = () => {
    const logsDOM = document.getElementById("logs");
    if (logsDOM) {
      logsDOM.scrollTop = logsDOM.scrollHeight;
    }
  };

  return (
    <div className=" p-3 px-10 bg-gray-100 border ">
      <div className=" flex gap-5 border font-bold underline">
        <Link to="/">主页</Link>
        <Link to="/wallet">创建钱包</Link>
        <Link to="/query">批量归集</Link>
        <Link to="/interacted">合约交互</Link>
      </div>
      <div className="  mt-3 p-4 relative">
        {isLogOpen ? (
          <div className=" absolute bg-[rgba(0,0,0,.8)] w-96 rounded font-mono text-white p-2 text-xs right-0 top-0">
            <div className=" flex justify-between">
              <div className=" flex gap-2 font-bold leading-6 text-[rgba(255,255,255,1)]">
                <div className=" underline cursor-pointer" onClick={clearLogs}>
                  清除日志
                </div>
                <div
                  className=" underline cursor-pointer"
                  onClick={downloadLogs}
                >
                  下载日志
                </div>
              </div>
              <div
                className=" underline cursor-pointer"
                onClick={() => setIsLogOpen(false)}
              >
                隐藏
              </div>
            </div>
            <hr />
            <div
              id="logs"
              className="h-48 py-1 overflow-y-scroll text-[rgba(255,255,255,1)]"
            >
              {logs.map((item) => {
                return <div>{item}</div>;
              })}
            </div>
          </div>
        ) : (
          <div
            className=" underline absolute bg-[rgba(0,0,0,.8)] cursor-pointer rounded font-mono text-white p-2 text-xs right-0 top-0"
            onClick={() => setIsLogOpen(true)}
          >
            显示日志
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}
