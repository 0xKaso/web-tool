import { ethers } from "ethers";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

export default function QueryPage() {
  const [rpc, setRpc] = useState();
  const [pk, setPK] = useState([]);
  const [collectTo, setCollectTo] = useState<any>();
  const [data, setData] = useState<any>([]);

  const [gas, setGas] = useState(0.03);

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
      const temp = {
        addr: await handleWallet.getAddress(),
        value: new BigNumber((await provider.getBalance(handleAddr)).toString())
          .div(10e17)
          .toFixed(5),
      };

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
  return (
    <div>
      <div>
        <div>RPC</div>
        <input
          type="text"
          placeholder="rpc"
          onChange={(e: any) => setRpc(e.target.value)}
        />
      </div>
      <div>
        <div>私钥</div>
        <textarea
          name="pk"
          id=""
          cols={30}
          rows={10}
          placeholder="请输入PK"
          onChange={updatePK}
        ></textarea>
      </div>
      <div>
        <div>结果</div>
        <table>
          <tr>
            <th>序号</th>
            <th>地址</th>
            <th>账户余额 ETH</th>
          </tr>
          {data.length > 0 &&
            data.map((item: any, index: any) => {
              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{item.addr}</td>
                  <td>{item.value.toString()}</td>
                </tr>
              );
            })}
        </table>
      </div>
      <div>
        归集
        <div>
          归集地址
          <input type="text" onChange={(e) => setCollectTo(e.target.value)} />
          手动gas
          <input
            type="number"
            value={gas}
            onChange={(e) => setGas(Number(e.target.value).valueOf())}
          />
        </div>
        <button onClick={collect}>确认归集</button>
        <button onClick={updateWalletDates}>更新余额</button>
      </div>
    </div>
  );
}
