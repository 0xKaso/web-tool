import { ethers } from "ethers";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

export default function QueryPage() {
  const [rpc, setRpc] = useState();
  const [pk, setPK] = useState([]);
  const [collectTo, setCollectTo] = useState<any>();
  const [data, setData] = useState<any>([]);
  const [gas, setGas] = useState(0.03);
  const [contractAddr, setContractAddr] = useState<any>("");

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

    if (checkStatu) setPK(r);
  };

  const updateWalletDates = async () => {
    if (!!rpc === false || pk.length === 0) return;
    console.log("🚀 ~ file: index.tsx:39 ~ updateWalletDates ~ pk:", pk);
    console.log("🚀 ~ file: index.tsx:39 ~ updateWalletDates ~ rpc:", rpc);
    console.log("同步数据中...");
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
  };

  const collect = async () => {
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
      } catch (error) {
        console.log("🚀 ~ file: index.tsx:75 ~ collect ~ error:", error);
      }
    }
  };

  const collectERC20 = async () => {
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
        } catch (error) {
          console.log("🚀 ~ file: index.tsx:75 ~ collect ~ error:", error);
        }
      }
    }
  };
  return (
    <div>
      <div className=" font-bold text-xl">配置项</div>

      <div className=" flex">
        <div>
          <div>RPC</div>
          <input
            className=" border rounded px-3 py-2 text-sm mr-3"
            type="text"
            placeholder="rpc"
            onChange={(e: any) => setRpc(e.target.value)}
          />
          <div>
            <div>私钥</div>
            <textarea
              className=" border rounded px-3 py-2 text-sm mr-3"
              name="pk"
              id=""
              cols={30}
              rows={10}
              placeholder="请输入PK"
              onChange={updatePK}
            ></textarea>
          </div>
        </div>

        <div>
          <div className="flex">
            钱包明细
            <div
              className=" bg-black text-white rounded ml-2  px-1 my-1 leading-5 text-xs cursor-pointer w-fit"
              onClick={updateWalletDates}
            >
              更新余额
            </div>
          </div>
          <div className=" h-[300px] min-w-[500px] overflow-scroll bg-white p-3 px-6 w-full rounded border">
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
            <span className="mr-2">扣留手续费</span>
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
