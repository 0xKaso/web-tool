import Wallet from "ethereumjs-wallet";
import { useState } from "react";
var FileSaver = require("file-saver");

import { saveAs } from "file-saver";
import { useModel } from "umi";

const DocsPage = () => {
  const [wallets, setWallets] = useState<any>([]);
  const [amount, setAmount] = useState<any>(50);

  const { pushLog } = useModel("logModel");

  const createWallet = () => {
    pushLog(`创建${amount}个钱包`);
    const tempWallets = [];

    pushLog("创建钱包中...")
    for (var i = 0; i < amount; i++) {
      const EthWallet = Wallet.generate(false);

      const tempWallet = {
        pk: EthWallet.getPrivateKeyString(),
        addr: EthWallet.getAddressString(),
      };

      tempWallets.push(tempWallet);
    }

    setWallets(tempWallets);
    pushLog("开始下载钱包文件...")
    var blob = new Blob([JSON.stringify(tempWallets)], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "wallet.txt");
    pushLog("下载完成")
  };

  return (
    <div className="">
      <div className=" flex mb-4">
        <input
          className=" border rounded px-3 py-2 text-sm mr-3"
          type="number"
          placeholder="填写创建钱包个数"
          defaultValue={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div
          className=" bg-black text-white rounded  px-3 py-2 text-sm cursor-pointer"
          onClick={createWallet}
        >
          创建钱包
        </div>
      </div>
      {wallets.map((wallet: any, index: number) => {
        return (
          <div className=" text-xs flex font-mono">
            <span>{wallet.addr},</span>
            <span>{wallet.pk}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DocsPage;
