import React, { useEffect, useRef, useState } from "react";
import currencyFormatter, {
  convertToCurrency,
  isAlphabetic,
} from "../Function/workWithCurrency";

import { toast } from "react-toastify";
import {
  handleApiErrorPromiseAndRemoveLocalstorage,
  showToastErrorContent,
} from "../Function/workWithApiError";
import axios from "axios";

import { FormWalletDataType } from "../ObjectType/WalletType";

export default function WalletTransformForm({
  isShowWalletTransformForm,
  isChangeTransferForm,
}: {
  isShowWalletTransformForm: boolean;
  isChangeTransferForm: any;
}) {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------
  const transClass = isShowWalletTransformForm ? "flex" : "hidden";
  const [amountTransfer, setAmountTransfer] = useState(0);
  const [isDisable, setIsDisable] = useState(false);
  const [fromWallet, setFromWallet] = useState<FormWalletDataType>({
    wallet_id: 0,
    wallet_name: "",
    wallet_balance: 0,
    wallet_description: "",
    del_flag: false,
    user_email: "",
    is_default_wallet: false,
  });
  const [toWallet, setToWallet] = useState<FormWalletDataType>({
    wallet_id: 0,
    wallet_name: "",
    wallet_balance: 0,
    wallet_description: "",
    del_flag: false,
    user_email: "",
    is_default_wallet: false,
  });
  const [listWallet, setListWallet] = useState<FormWalletDataType[]>([]);
  const balanceInputValueRef = useRef("0");

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const onChangeSelectFrom = (wallet_id: any, type: string) => {
    let walletDataLocal = JSON.parse(localStorage.getItem("wallet") as any);

    if (walletDataLocal && walletDataLocal.length > 0) {
      let onChangeWallet = walletDataLocal.filter(
        (w: FormWalletDataType) => w.wallet_id === Number(wallet_id)
      );
      if (onChangeWallet[0]) {
        if (type === "from") {
          setFromWallet(onChangeWallet[0]);
        } else {
          setToWallet(onChangeWallet[0]);
        }
      }
    }
  };

  const validateTransferWalletFrom = () => {
    if (fromWallet.wallet_id === 0 || toWallet.wallet_id === 0) {
      showToastErrorContent("Please create Wallet!!!");
      return false;
    }
    if (fromWallet.wallet_id === toWallet.wallet_id) {
      showToastErrorContent("The same wallet!!!");
      return false;
    }
    if (amountTransfer <= 0) {
      showToastErrorContent("Amount must be greater than zero!");
      return false;
    }
    return true;
  };

  const handleWalletFormChange = (event: any) => {
    if (isAlphabetic(event.target.value)) {
      return;
    }

    let transferValue = convertToCurrency(
      event.target.value,
      balanceInputValueRef.current
    );

    if (Number.isNaN(transferValue)) {
      transferValue = 0;
    }
    balanceInputValueRef.current = transferValue.toString();
    setAmountTransfer(transferValue);
  };

  const updateWalletLocalStorage = (
    newFromWallet: FormWalletDataType,
    newToWallet: FormWalletDataType
  ) => {
    const existingWallets = JSON.parse(localStorage.getItem("wallet") || "[]");

    // Find and update both wallets in a single iteration
    existingWallets.forEach((wallet: FormWalletDataType, index: any) => {
      if (
        wallet.wallet_id === newFromWallet.wallet_id ||
        wallet.wallet_id === newToWallet.wallet_id
      ) {
        existingWallets[index] =
          wallet.wallet_id === newFromWallet.wallet_id
            ? newFromWallet
            : newToWallet;
      }
    });

    localStorage.setItem("wallet", JSON.stringify(existingWallets));
  };

  const handleTransferWallet = async () => {
    if (!validateTransferWalletFrom()) return;
    try {
      setIsDisable(true);
      isChangeTransferForm(Math.random() * 1000);
      fromWallet.wallet_balance = fromWallet.wallet_balance - amountTransfer;
      toWallet.wallet_balance = toWallet.wallet_balance + amountTransfer;

      axios.post("/api/wallet/insertUpdateWallet", fromWallet, {
        headers: {
          Authorization: localStorage.getItem("jwt_token"),
        },
      });
      await toast.promise(
        axios.post("/api/wallet/insertUpdateWallet", toWallet, {
          headers: {
            Authorization: localStorage.getItem("jwt_token"),
          },
        }),
        {
          pending: {
            render() {
              return "Transfer...";
            },
          },
          success: {
            render() {
              setTimeout(() => {
                setDefaultFrom(false);
                setIsDisable(false);
              }, 2000);

              return "Transfer Wallet successfully!";
            },
          },
          error: {
            render({ data }) {
              console.log(data);
              return handleApiErrorPromiseAndRemoveLocalstorage(data);
            },
          },
        }
      );
      updateWalletLocalStorage(fromWallet, toWallet);
    } catch (error: any) {
      setIsDisable(false);
      handleApiErrorPromiseAndRemoveLocalstorage(error);
    }
  };
  const setDefaultFrom = (isFirstTime: boolean) => {
    let walletDataLocal = JSON.parse(localStorage.getItem("wallet") as any);
    if (walletDataLocal && walletDataLocal.length > 0) {
      if (isFirstTime) {
        setFromWallet(walletDataLocal[0]);

        if (walletDataLocal.length > 1) {
          setToWallet(walletDataLocal[1]);
        } else {
          setToWallet(walletDataLocal[0]);
        }
      } else {
        setFromWallet(fromWallet);
        setToWallet(toWallet);
      }

      setListWallet(walletDataLocal);
      setAmountTransfer(0);
    }
  };
  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    setDefaultFrom(true);
  }, [isShowWalletTransformForm]);

  return (
    <>
      <fieldset disabled={isDisable}>
        <div
          className={`absolute  w-full lg:w-1/3  max-h-[290px] top-32 z-30  min-h-[290px]   flex-col py-4  rounded-md ${transClass} bg-zinc-200 dark:bg-gray-600  dark:text-white`}
        >
          <div className="text-2xl font-medium text-gray-900 dark:text-white text-center  overflow-hidden">
            Transform Wallet
          </div>
          <div className="grid grid-cols-12 mt-3">
            <div className="col-span-5 ml-2 ">
              <select
                value={fromWallet.wallet_id}
                onChange={(e) => {
                  onChangeSelectFrom(e.target.value, "from");
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
              >
                {listWallet &&
                  listWallet.map((w: FormWalletDataType) => (
                    <option key={w.wallet_id} value={w.wallet_id}>
                      {w.wallet_name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex col-span-2 text-center justify-center items-center ">
              <iframe
                src="https://giphy.com/embed/NU4il2utBo5Lq"
                width="32px"
                height="29px"
                allowFullScreen
              ></iframe>

              <p>
                <a href="https://giphy.com/gifs/arrow-NU4il2utBo5Lq"></a>
              </p>
            </div>
            <div className="col-span-5 mr-2">
              <select
                value={toWallet.wallet_id}
                onChange={(e) => {
                  onChangeSelectFrom(e.target.value, "to");
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {listWallet &&
                  listWallet.map((w: FormWalletDataType) => (
                    <option key={w.wallet_id} value={w.wallet_id}>
                      {w.wallet_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-12 mt-1">
            <div className="col-span-5 flex text-center justify-center">
              <div>
                <input
                  disabled
                  type="text"
                  value={currencyFormatter(fromWallet.wallet_balance)}
                  inputMode="numeric"
                  name="wallet_balance"
                  className="text-sm text-center h-8 w-32 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                />
              </div>
            </div>
            <div className=" col-span-2 "></div>
            <div className="col-span-5 flex text-center justify-center">
              <input
                disabled
                type="text"
                value={currencyFormatter(toWallet.wallet_balance)}
                inputMode="numeric"
                name="wallet_balance"
                className="text-sm text-center h-8 w-32 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
              />
            </div>
          </div>
          <div className="flex text-center justify-center">
            <input
              type="text"
              id="success"
              value={currencyFormatter(amountTransfer)}
              onChange={handleWalletFormChange}
              inputMode="numeric"
              className="flex text-xl text-center mt-3 bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500  rounded-lg focus:ring-green-500 focus:border-green-500  w-40 h-9 p-2.5 dark:bg-gray-700 dark:border-green-500"
              placeholder="Amount..."
            />
          </div>
          <div className="mt-9 flex text-center justify-center">
            <button
              type="button"
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={handleTransferWallet}
            >
              Transfer
            </button>
          </div>
        </div>
      </fieldset>
    </>
  );
}
