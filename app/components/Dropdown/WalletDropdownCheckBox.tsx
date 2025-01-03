import React, { useEffect, useRef, useState } from "react";
import "../../css/Button.css";
import { GoChevronDown } from "react-icons/go";

export default function WalletDropdownCheckBox() {
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
    getWalletData();
  }, []);

  return (
    <>
      <div className="relative ">
        <button
          className="flex text-white font-semibold text-sm text-center p-6 py-4 "
          onClick={toggle}
        >
          Wallet
          <GoChevronDown style={{ fontSize: "23px" }}> </GoChevronDown>
        </button>
        <div
          className={`absolute -right-5 overflow-scroll max-h-[210px] top-12 z-30 max-w-[280px] min-w-[16rem;] min-h-[100px]  flex flex-col py-4 bg-zinc-50 rounded-md ${transClass} dark:bg-slate-500 dark:text-white`}
        >
          {walletData &&
            walletData.map((element: any) => (
              <div className="flex items-center mb-2" key={element.wallet_id}>
                <a
                  className="min-w-[12rem;] max-w-[12rem;]  whitespace-nowrap overflow-x-auto hover:bg-zinc-300 hover:text-zinc-500 px-2 py-1 "
                  href={"#"}
                  onClick={toggle}
                >
                  {element.wallet_name}
                </a>
                {element.wallet_id !== 0 && (
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    value=""
                    className=" ml-4 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                )}
              </div>
            ))}
        </div>
      </div>
      {isOpen ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/20"
          onClick={toggle}
        ></div>
      ) : (
        <></>
      )}
    </>
  );
}
