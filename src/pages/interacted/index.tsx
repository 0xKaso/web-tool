import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useModel } from "umi";

export default function Interacted() {
  const [rpc, setRpc] = useState<any>();
  const [pk, setPK] = useState([]);
  const [abi, setAbi] = useState<any>([]);
  const [chooseFun, setChooseFun] = useState<any>({});
  const [pkStatus, setPkStatus] = useState<any>(false);
  const [args, setArgs] = useState<any>([]);

  const { logs, pushLog } = useModel("logModel");

  const [contractAddr, setContractAddr] = useState<any>("");

  const updateABI = (e: any) => {
    const { value } = e.target;
    try {
      const r = JSON.parse(value);

      console.log("🚀 ~ file: index.tsx:19 ~ updateABI ~ r:", r);
      setAbi(r);
      setChooseFun(r[0]);
    } catch (error) {
      setAbi([]);
    }
  };

  const updatePK = (e: any) => {
    const { value } = e.target;
    const r = value.split("\n");

    const checkStatu = r.reduce((r: any, cur: any) => {
      if (cur.length !== 64 && cur.length !== 66) r = false;
      return r;
    }, true);

    if (checkStatu) {
      setPkStatus(true);
      setPK(r);
    }

    if (!checkStatu) {
      setPkStatus(false);
    }
  };

  const updateArguments = (e: any, index: number) => {
    const { value } = e.target;
    console.log(value, index);

    const temp = [...args];
    temp[index] = value;

    setArgs(temp);
  };

  const play = async () => {
    const contract = new ethers.Contract(contractAddr, abi);

    for (let i = 0; i < pk.length; i++) {
      const handlePK = pk[i];
      const provider = new ethers.JsonRpcProvider(rpc);
      const handleWallet = new ethers.Wallet(handlePK, provider);

      try {
        console.log("🚀 ~ file: index.tsx:67 ~ play ~ chooseFun:", chooseFun);
        await (contract as any).connect(handleWallet)[chooseFun.name](...args);
      } catch (error) {
        console.log("🚀 ~ file: index.tsx:66 ~ play ~ error:", error);
      }
    }
  };

  return (
    <div>
      <div>
        <div className=" font-bold text-xl my-2">RPC</div>
        <div>
          <input
            className=" border rounded px-3 py-2 text-sm mr-3"
            type="text"
            onChange={(e) => setRpc(e.target.value)}
          />
        </div>
      </div>
      <div>
        <div className=" font-bold text-xl my-2">合约地址</div>
        <div>
          <input
            className=" border rounded px-3 py-2 text-sm mr-3"
            type="text"
            onChange={(e) => setContractAddr(e.target.value)}
          />
        </div>
      </div>
      <div>
        <div className=" font-bold text-xl my-2">私钥</div>
        <div className="flex gap-2 items-center">
          <div
            className={`"rounded-full w-[10px] h-[10px] ${
              pkStatus ? "bg-green-800" : "bg-red-800"
            }`}
          ></div>
          <div> {pkStatus ? "私钥录入成功" : "私钥未录入或有误"}</div>
        </div>
        <div>
          <textarea
            className=" border rounded px-3 py-2 text-sm mr-3 w-full"
            cols={30}
            rows={10}
            onChange={updatePK}
          ></textarea>
        </div>
      </div>
      <div>
        <div className=" font-bold text-xl my-2">ABI</div>
        <textarea
          className=" border rounded px-3 py-2 text-sm mr-3 w-full"
          cols={30}
          rows={10}
          value={JSON.stringify(abi)}
          onChange={updateABI}
        ></textarea>
        <div className=" font-bold text-xl my-2">Function</div>
        <select
          className=" border rounded px-3 py-2 text-sm mr-3"
          onChange={(e: any) => {
            setChooseFun(JSON.parse(e.target.value));
          }}
        >
          {abi.map((item: any, index: any) => {
            return (
              <option key={index} value={JSON.stringify(item)}>
                {item.name}
              </option>
            );
          })}
        </select>
        {chooseFun.length != 0 && (
          <>
            <div className=" font-bold text-xl my-2">参数</div>
            <div>
              {chooseFun.inputs?.map((item: any, index: any) => {
                return (
                  <div key={index}>
                    <div className="flex my-2" key={index}>
                      <div className=" w-24">{item.name}</div>
                      <input
                        className=" border rounded px-3 py-2 text-sm mr-3"
                        type="text"
                        placeholder={item.type}
                        onChange={(e) => updateArguments(e, index)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div
          onClick={play}
          className=" bg-black text-white rounded  px-3 py-2 text-sm cursor-pointer w-fit"
        >
          执行交互
        </div>
      </div>
    </div>
  );
}
