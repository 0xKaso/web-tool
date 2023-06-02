import { ethers } from "ethers";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useModel } from "umi";

export default function QueryPage() {
  const [rpc, setRpc] = useState();
  const [pk, setPK] = useState([]);
  const [collectTo, setCollectTo] = useState<any>();
  const [data, setData] = useState<any>([]);
  const [gas, setGas] = useState(0.03);
  const [contractAddr, setContractAddr] = useState<any>("");

  const [pkStatus, setPkStatus] = useState<any>(false);
  const { pushLog } = useModel("logModel");

  useEffect(() => {
    updateWalletDates();
  }, [pk, rpc]);

  const updatePK = (e: any) => {
    const { value } = e.target;
    const r = value.split("\n");

    const checkStatu = r.reduce((r: any, cur: any) => {
      if (cur.length !== 64 && cur.length !== 66) r = false;
      return r;
    }, true);

    if (checkStatu) {
      pushLog(`钱包更新成功,合计${r.length}个钱包地址`);
      setPkStatus(true);
      setPK(r);
    }

    if (!checkStatu) {
      setPkStatus(false);
    }
  };

  const updateWalletDates = async () => {
    if (!!rpc === false || pk.length === 0) return;
    pushLog("开始更新钱包数据...");
    const provider = new ethers.JsonRpcProvider(rpc);

    let wllets = [];
    for (let i = 0; i < pk.length; i++) {
      const handlePK = pk[i];
      const handleWallet = new ethers.Wallet(handlePK, provider);
      const handleAddr = await handleWallet.getAddress();
      const temp: any = {
        index: i,
        addr: await handleWallet.getAddress(),
        value: new BigNumber((await provider.getBalance(handleAddr)).toString())
          .div(10e17)
          .toFixed(5),
      };

      if (!!contractAddr) {
        const contract = new ethers.Contract(
          contractAddr,
          ["function balanceOf(address owner) view returns (uint256)"],
          handleWallet
        );
        const balance = await contract.balanceOf(handleAddr);
        temp["token"] = new BigNumber(balance.toString()).toFixed(0);
        console.log(temp);
      }

      wllets.push(temp);
    }
    setData(wllets);
    pushLog("钱包数据更新完成");
  };

  const collect = async () => {
    pushLog("开始收款...");
    const provider = new ethers.JsonRpcProvider(rpc);
    for (let i = 0; i < pk.length; i++) {
      const handlePK = pk[i];
      const handleWallet = new ethers.Wallet(handlePK, provider);
      try {
        await handleWallet.sendTransaction({
          to: collectTo,
          value: ethers.parseEther(
            (Number(data[i].value).valueOf() - gas).toString()
          ),
        });
        pushLog(`收款成功, ${handleWallet.address}`)
      } catch (error) {
        pushLog(`收款失败, ${handleWallet.address}`)
      }
    }
  };

  const collectERC20 = async () => {
    pushLog("开始收款...");
    const provider = new ethers.JsonRpcProvider(rpc);
    const contract = new ethers.Contract(contractAddr, [
      "function transfer(address to, uint256 value) returns (bool)",
    ]);

    for (let i = 0; i < pk.length; i++) {
      if (data[i].token > 0) {
        const handlePK = pk[i];
        const handleWallet = new ethers.Wallet(handlePK, provider);
        try {
          await contract
            .connect(handleWallet)
            .transfer(collectTo, data[i].token);
          pushLog(`收款成功, ${handleWallet.address}`)
        } catch (error) {
          pushLog(`收款失败, ${handleWallet.address}`)
        }
      }
    }
    pushLog("收款完成");
  };
  
  return (
    <div>
      <div className=" font-bold text-xl">配置项</div>
      <div className=" ">
        <div className=" font-bold text-xl my-2">RPC</div>
        <input
          className=" border rounded px-3 py-2 text-sm mr-3"
          type="text"
          placeholder="rpc"
          onChange={(e: any) => setRpc(e.target.value)}
        />
        <div>
          <div className=" font-bold text-xl my-2">私钥</div>
          <textarea
            className=" border rounded px-3 py-2 text-sm mr-3 w-full"
            cols={30}
            rows={10}
            placeholder="请输入PK"
            onChange={updatePK}
          ></textarea>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className=" flex gap-2 items-center">
            <div className=" font-bold text-xl my-2">钱包明细</div>
            <div
              className=" bg-black text-white h-fit rounded  px-1 my-1 leading-5 text-xs cursor-pointer w-fit"
              onClick={updateWalletDates}
            >
              更新余额
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div
              className={`"rounded-full w-[10px] h-[10px] ${
                pkStatus ? "bg-green-800" : "bg-red-800"
              }`}
            ></div>
            <div> {pkStatus ? "私钥录入成功" : "私钥未录入或有误"}</div>
          </div>
        </div>
        <div className=" min-h-[250px] overflow-scroll bg-white p-3 px-6 w-full rounded border">
          <div className=" flex justify-between font-bold underline">
            {data.length > 0 &&
              Object.keys(data[0]).map((key: any) => (
                <div>{key.toUpperCase()}</div>
              ))}
          </div>
          {data.length > 0 &&
            data.map((item: any, index: any) => {
              const keys = Object.keys(item);
              return (
                <div className=" flex gap-3 font-mono" key={index}>
                  {keys.map((key: any) => (
                    <div>
                      {item[key]} {"  "}
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      </div>

      <hr />

      <div className="py-3">
        <div className=" font-bold text-xl">Native Token 归集</div>
        <div className=" my-2">
          <div>
            <span className="mr-2">归集地址</span>
            <input
              className=" border rounded px-3 py-2 text-sm mr-3"
              type="text"
              value={collectTo}
              onChange={(e) => setCollectTo(e.target.value)}
            />
          </div>
          <div className="my-2">
            <span className="mr-2">扣留额度</span>
            <input
              type="number"
              className=" border rounded px-3 py-2 text-sm mr-3"
              value={gas}
              onChange={(e) => setGas(Number(e.target.value).valueOf())}
            />
          </div>
        </div>

        <div
          className=" bg-black text-white rounded  px-3 py-2 text-sm cursor-pointer w-fit"
          onClick={collect}
        >
          确认归集
        </div>
      </div>
      <hr />
      <div className="py-3">
        <div className=" font-bold text-xl">ERC20 归集</div>
        <span className="mr-2">合约地址</span>
        <input
          type="text"
          className=" my-2 border rounded px-3 py-2 text-sm mr-3"
          placeholder="合约地址"
          onChange={(e) => setContractAddr(e.target.value)}
        />
        <div className="my-2">
          <span className="mr-2">归集地址</span>
          <input
            className=" border rounded px-3 py-2 text-sm mr-3"
            type="text"
            value={collectTo}
            onChange={(e) => setCollectTo(e.target.value)}
          />
        </div>
        <div
          className=" bg-black text-white rounded  px-3 py-2 text-sm cursor-pointer w-fit"
          onClick={collectERC20}
        >
          确认归集
        </div>
      </div>
    </div>
  );
}
