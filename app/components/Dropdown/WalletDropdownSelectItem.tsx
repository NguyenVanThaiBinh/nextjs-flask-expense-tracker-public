import React, { useEffect, useRef, useState } from "react";
import "../../css/Button.css";

export default function WalletDropdownSelectItem({
  isShowWalletListProps: isShowWalletListProps,
  handleClick,
}: {
  isShowWalletListProps: any;
  handleClick: any;
}) {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const transClass = isOpen ? "flex" : "hidden";
  const [walletData, setWalletData] = useState<any>([]);

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const toggle = () => {
    getWalletData();
    setIsOpen((old) => !old);
  };

  const getWalletData = () => {
    let walletDataLocal = JSON.parse(localStorage.getItem("wallet") as any);
    if (walletDataLocal) {
      setWalletData(walletDataLocal);
    } else {
      setWalletData([{ wallet_name: "There is't wallet.", wallet_id: 0 }]);
    }
  };
  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    if (isShowWalletListProps) {
      toggle();
    }
  }, []);

  return (
    <>
      <div className="relative">
        <div
          className={`absolute flex flex-col py-4 -right-1 z-30 max-w-[280px] min-w-[12rem;] min-h-[100px] overflow-scroll max-h-[170px]  bg-zinc-50 rounded-md ${transClass} dark:bg-slate-500 dark:text-white`}
        >
          {walletData &&
            walletData.map((element: any) => (
              <div className="flex  items-start mb-2" key={element.wallet_id}>
                <button
                  className="min-w-[12rem;] max-w-[12rem;] text-left  whitespace-nowrap overflow-x-auto hover:bg-zinc-300 hover:text-zinc-500 px-2 py-1 "
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(false, element);
                  }}
                >
                  {element.wallet_name}
                </button>
              </div>
            ))}
        </div>
      </div>
      {isOpen ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/20"
          onClick={() => {
            handleClick(false, null);
            setIsOpen((old) => !old);
          }}
        ></div>
      ) : (
        <></>
      )}
    </>
  );
}
