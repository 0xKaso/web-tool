import { useState } from "react";

export default function Interacted() {
  const [rpc, setRpc] = useState();
  const [pk, setPK] = useState([]);
  const [abi, setAbi] = useState<any>([]);
  const [chooseFun, setChooseFun] = useState<any>({});

  const updateABI = (e: any) => {
    const { value } = e.target;
    try {
      const r = JSON.parse(value);
      setAbi(r);
    } catch (error) {
      setAbi([]);
    }
  };

  return (
    <div>
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
                  <div>
                    <div className="flex my-2" key={index}>
                      <div className=" w-24">{item.name}</div>
                      <input
                        className=" border rounded px-3 py-2 text-sm mr-3"
                        type="text"
                        placeholder={item.type}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className=" bg-black text-white rounded  px-3 py-2 text-sm cursor-pointer w-fit">
          执行交互
        </div>
      </div>
    </div>
  );
}
