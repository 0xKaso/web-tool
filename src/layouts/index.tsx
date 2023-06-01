import { Link, Outlet } from "umi";
import styles from "./index.less";

export default function Layout() {
  return (
    <div className=" p-3 px-10 bg-gray-100 border ">
      <div className=" flex gap-5 border font-bold underline">
        <Link to="/">主页</Link>
        <Link to="/wallet">创建钱包</Link>
        <Link to="/query">批量归集</Link>
      </div>
      <div className=" border mt-3 p-4">
        <Outlet />
      </div>
    </div>
  );
}
