import React, { useEffect, useState } from "react";
import ShowFormButton from "../Button/ShowFormButton";
import { FaWallet } from "react-icons/fa";
import CreateWalletForm from "../Form/WalletForm";
import Loading from "../Effect/Loading";

import "react-toastify/dist/ReactToastify.css";
import fetchDataWithEndPoint from "../Function/workWithFetchData";
import currencyFormatter from "../Function/workWithCurrency";
import BoldLine from "../Line/BoldLine";
import { ToastContainer } from "react-toastify";
import { FormWalletDataType } from "../ObjectType/WalletType";

export const moveDefaultWalletFirst = () => {
  let default_wallet_id = localStorage.getItem("default_wallet_id") || "0";
  let listWalletData = JSON.parse(localStorage.getItem("wallet") as any);
  let index = -1;

  if (!listWalletData) return;

  const wallet = listWalletData.filter(
    (wallet: any) => wallet.wallet_id === Number(default_wallet_id)
  );

  if (wallet) {
    index = listWalletData.indexOf(wallet[0]);
  }

  if (index !== -1) {
    const element = listWalletData.splice(index, 1)[0];
    listWalletData.unshift(element);
  }

  localStorage.setItem("wallet", JSON.stringify(listWalletData));
};
export default function WalletComponent({
  isChangeTransferForm,
}: {
  isChangeTransferForm: boolean;
}) {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------
  const [isShowCreateWalletForm, setIsShowCreateWalletForm] =
    useState<boolean>(false);
  const [listWalletData, setListWalletData] = useState<FormWalletDataType[]>(
    []
  );
  const [selectingWalletData, setSelectingWalletData] =
    useState<FormWalletDataType>();
  const [isShowWallet, setIsShowWallet] = useState(false);
  const [totalValueWallet, setTotalValueWallet] = useState(0);

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const countToTalValueWallet = (walletData: FormWalletDataType[]) => {
    let sum = 0;
    walletData.forEach((wallet: FormWalletDataType) => {
      sum += wallet.wallet_balance;
    });
    setTotalValueWallet(sum);
  };

  const checkWalletData = async () => {
    try {
      let listWalletData =
        JSON.parse(localStorage.getItem("wallet") as any) || [];

      listWalletData.length >= 0 && countToTalValueWallet(listWalletData);

      if (!listWalletData || listWalletData.length === 0) {
        setListWalletData(listWalletData);
        setIsShowWallet(true);
        return;
      }
      setIsShowWallet(true);
      moveDefaultWalletFirst();

      setListWalletData(listWalletData);
    } catch (error: any) {
      console.error(error);
    }
  };
  const handleFromChildComponent = (
    isShowCreateWalletForm: boolean,
    type: string
  ) => {
    setIsShowCreateWalletForm(isShowCreateWalletForm);
    setSelectingWalletData({
      wallet_id: 0,
      wallet_name: "",
      wallet_balance: 0,
      wallet_description: "",
      del_flag: false,
      user_email: "",
      is_default_wallet: false,
    });

    checkWalletData();
  };

  const handleOnclickWallet = (walletElement: FormWalletDataType) => {
    setSelectingWalletData(walletElement);
    setIsShowCreateWalletForm(true);
  };

  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    checkWalletData();
  }, [isChangeTransferForm]);

  return (
    <>
      <ToastContainer autoClose={1500} limit={4}></ToastContainer>
      <div className="lg:contents  ">
        {isShowCreateWalletForm && (
          <CreateWalletForm
            isShowCreateWalletForm={handleFromChildComponent as any}
            walletDataProps={selectingWalletData as FormWalletDataType}
          />
        )}

        {isShowCreateWalletForm ? (
          <div
            className="lg:contents fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/20"
            onClick={() => setIsShowCreateWalletForm(false)}
          ></div>
        ) : (
          <></>
        )}
      </div>
      <div
        className={
          isShowCreateWalletForm
            ? "z-4 lg:hidden fixed top-[4.2rem;] right-0 w-full flex-col py-4 px-4 bg-zinc-200 dark:bg-gray-600  rounded-md flex dark:text-white"
            : "w-full flex-col py-4 px-4 bg-zinc-200 dark:bg-gray-600  rounded-md flex dark:text-white"
        }
      >
        <div className="grid mb-2 text-center text-lg font-bold text-blue-600 grid-cols-2 gap-4 grid-flow-col dark:text-white">
          <div>Total</div>

          <span className="grid text-right whitespace-nowrap overflow-x-auto dark:text-white">
            {currencyFormatter(totalValueWallet)}
          </span>
        </div>
        <BoldLine></BoldLine>
        <div className=" w-full  max-h-[25em;] min-h-[25em;] overflow-scroll lg:overflow-auto">
          {isShowWallet ? (
            <>
              {listWalletData &&
                listWalletData.map((walletElement: any) => (
                  <button
                    className="grid grid-cols-12 gap-4 mb-4 p-2 w-full"
                    id={walletElement.wallet_id}
                    key={walletElement.wallet_id}
                    onClick={() => handleOnclickWallet(walletElement)}
                    title={walletElement.wallet_description}
                  >
                    <div className="col-span-7 flex">
                      <FaWallet
                        style={{
                          fontSize: "22px",
                          color: "darkcyan",
                          minWidth: "22px",
                        }}
                      />
                      <span className="min-w-[10rem;] text-left  ml-2 text-base font-medium text-cyan-600 whitespace-nowrap overflow-x-auto">
                        {walletElement.wallet_name}
                      </span>
                    </div>

                    <div className="col-span-5 text-right whitespace-nowrap overflow-x-auto text-cyan-600 ">
                      {currencyFormatter(walletElement.wallet_balance)}
                    </div>
                  </button>
                ))}
            </>
          ) : (
            <>
              <Loading></Loading>
            </>
          )}
        </div>

        <div className="fixed top-[85%] left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <ShowFormButton
            isShowForm={handleFromChildComponent}
          ></ShowFormButton>
        </div>
      </div>
    </>
  );
}
