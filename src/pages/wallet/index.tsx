import Wallet from "ethereumjs-wallet";
import { useState } from "react";

const DocsPage = () => {
  const [wallets, setWallets] = useState<any>([]);
  const [amount, setAmount] = useState<any>(50);

  const createWallet = () => {
    const tempWallets = [];

    for (var i = 0; i < amount; i++) {
      const EthWallet = Wallet.generate(false);

      const tempWallet = {
        pk: EthWallet.getPrivateKeyString(),
        addr: EthWallet.getAddressString(),
      };
      
      tempWallets.push(tempWallet);
    }

    setWallets(tempWallets);
  };

  return (
    <div>
      <div>
        <input
          type="number"
          placeholder="填写创建钱包个数"
          defaultValue={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={createWallet}>点击创建钱包</button>
      </div>
      {wallets.map((wallet: any, index: number) => {
        return (
          <div>
            <span>{wallet.addr}</span>
            ----
            <span>{wallet.pk}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DocsPage;
