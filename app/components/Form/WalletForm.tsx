import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import handleApiErrorAndRemoveLocalstorage, {
  handleApiErrorPromiseAndRemoveLocalstorage,
  showToastErrorContent,
} from "../Function/workWithApiError";
import currencyFormatter, {
  convertToCurrency,
  isAlphabetic,
} from "../Function/workWithCurrency";
import isDeleteConfirmAlert from "../Function/workWithAlert";
import isDeepEqualObject from "../Function/workWithObject";
import { FormWalletDataType } from "../ObjectType/WalletType";
export default function CreateWalletForm({
  isShowCreateWalletForm: isShowCreateWalletForm,
  walletDataProps: walletDataProps,
}: {
  isShowCreateWalletForm: (isOpen: boolean, type?: string) => any;
  walletDataProps: FormWalletDataType;
}) {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------
  const [isVisible, setIsVisible] = useState("visible");
  const [isDisable, setIsDisable] = useState(false);
  const [isEditFrom, setIsEditFrom] = useState(false);
  const [formWalletData, setFormWalletData] = useState<FormWalletDataType>({
    wallet_id: 0,
    wallet_name: "",
    wallet_balance: 0,
    wallet_description: "",
    del_flag: false,
    user_email: "",
    is_default_wallet: false,
  });

  const balanceInputValueRef = useRef("0");
  const inputFocusRef = useRef<any>(null);
  const checkWalletData = useRef<FormWalletDataType>();

  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    if (walletDataProps && walletDataProps.wallet_id !== 0) {
      let default_wallet_id = localStorage.getItem("default_wallet_id") || "0";
      if (Number(default_wallet_id) === walletDataProps.wallet_id) {
        walletDataProps.is_default_wallet = true;
      } else {
        walletDataProps.is_default_wallet = false;
      }

      setIsEditFrom(true);
      setFormWalletData({
        is_default_wallet: walletDataProps.is_default_wallet,
        wallet_id: walletDataProps.wallet_id,
        wallet_name: walletDataProps.wallet_name,
        wallet_balance: walletDataProps.wallet_balance,
        wallet_description: walletDataProps.wallet_description,
        del_flag: walletDataProps.del_flag,
        user_email: walletDataProps.user_email,
      });
      checkWalletData.current = walletDataProps;
    } else {
      inputFocusRef.current.focus();
      checkWalletData.current = formWalletData;
    }
  }, []);

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const handleCloseCreateWalletForm = () => {
    isShowCreateWalletForm(false);
  };

  const handleWalletFormChange = (event: any) => {
    if (event.target.name === "wallet_balance") {
      if (isAlphabetic(event.target.value)) {
        return;
      }

      let wallet_balance_value = convertToCurrency(
        event.target.value,
        balanceInputValueRef.current
      );

      if (Number.isNaN(wallet_balance_value)) {
        wallet_balance_value = 0;
        setFormWalletData({
          ...formWalletData,
          ["wallet_balance"]: 0,
        });
      }

      balanceInputValueRef.current = wallet_balance_value.toString();

      setFormWalletData({
        ...formWalletData,
        ["wallet_balance"]: wallet_balance_value,
      });
      return;
    }

    setFormWalletData({
      ...formWalletData,
      [event.target.name]: event.target.value,
    });
  };
  const updateDefaultWalletId = (newWallet: any) => {
    try {
      let default_wallet_id = localStorage.getItem("default_wallet_id") || "0";
      let defaultWalletId = newWallet.wallet_id;
      if (
        (isEditFrom &&
          !formWalletData.is_default_wallet &&
          Number(default_wallet_id) !== formWalletData.wallet_id) ||
        (formWalletData.del_flag &&
          Number(default_wallet_id) !== formWalletData.wallet_id)
      ) {
        return;
      }
      if (
        newWallet.wallet_id &&
        formWalletData.is_default_wallet &&
        !formWalletData.del_flag
      ) {
        localStorage.setItem("default_wallet_id", newWallet.wallet_id);
      } else if (
        (formWalletData.del_flag &&
          Number(default_wallet_id) === formWalletData.wallet_id) ||
        (isEditFrom &&
          !formWalletData.is_default_wallet &&
          Number(default_wallet_id) === formWalletData.wallet_id)
      ) {
        localStorage.setItem("default_wallet_id", "null");
        defaultWalletId = null;
      }
      axios.post(
        "/api/userExpense/updateDefaultWalletUserExpense",
        { default_wallet_id: defaultWalletId },
        {
          headers: {
            Authorization: localStorage.getItem("jwt_token") || null,
          },
        }
      );
    } catch (error: any) {
      handleApiErrorAndRemoveLocalstorage(error);
    }
  };

  const handleWalletFormSubmit = async (isEditMode: any, type: string) => {
    if (formWalletData.wallet_name.trim() === "") {
      showToastErrorContent("Wallet Name is Null!");
      return;
    }
    if (
      checkWalletData.current &&
      isEditFrom &&
      type !== "delete" &&
      isDeepEqualObject(formWalletData, checkWalletData.current)
    ) {
      showToastErrorContent("Nothing to update !");
      return;
    }

    // setIsVisible("invisible");
    setIsDisable(true);
    if (isEditMode && type === "delete") {
      if ((await isDeleteConfirmAlert()) === false) {
        setIsVisible("visible");
        return;
      }
      formWalletData.del_flag = true;
    }
    let newWallet: any;

    try {
      await toast.promise(
        axios.post("/api/wallet/insertUpdateWallet", formWalletData, {
          headers: {
            Authorization: localStorage.getItem("jwt_token"),
          },
        }),
        {
          pending: {
            render() {
              return isEditFrom && type === "delete"
                ? "Deleting Wallet..."
                : isEditFrom
                ? "Editing Wallet..."
                : "Saving Wallet...";
            },
          },
          success: {
            render({ data }) {
              setTimeout(() => {
                isShowCreateWalletForm(false, "new");
                setIsDisable(false);
              }, 2000);

              newWallet = data.data.new_wallet;

              let existingWallets = JSON.parse(
                localStorage.getItem("wallet") || "[]"
              );

              if (existingWallets.length > 0 && isEditFrom) {
                existingWallets = existingWallets.filter(
                  (wallet: any) => wallet.wallet_id !== newWallet.wallet_id
                );
              }

              if (newWallet.del_flag === false) {
                let default_wallet_id =
                  localStorage.getItem("default_wallet_id") || "0";
                if (Number(default_wallet_id) === newWallet.wallet_id) {
                  existingWallets.splice(0, 0, newWallet);
                } else {
                  existingWallets.splice(1, 0, newWallet);
                }

                localStorage.setItem("wallet", JSON.stringify(existingWallets));
              } else {
                Object.keys(localStorage).forEach(function (key) {
                  if (/^expense_/.test(key)) {
                    localStorage.removeItem(key);
                  }
                });
                localStorage.setItem("wallet", JSON.stringify(existingWallets));
              }

              if (
                isEditMode ||
                (!isEditMode && formWalletData.is_default_wallet === true)
              ) {
                updateDefaultWalletId(newWallet);
              }

              return isEditFrom && type === "delete"
                ? "Delete Wallet successfully!"
                : isEditFrom
                ? "Edit Wallet successfully"
                : "Add Wallet successfully!";
            },
          },
          error: {
            render({ data }) {
              return handleApiErrorPromiseAndRemoveLocalstorage(data);
            },
          },
        }
      );
    } catch (error: any) {
      setIsDisable(false);
      setIsVisible("visible");
    }
  };

  return (
    <>
      {<ToastContainer autoClose={false} containerId="WalletForm" />}
      <fieldset disabled={isDisable} className="z-10">
        <form
          noValidate
          onSubmit={(event) => event.preventDefault()}
          className={` ${isVisible} lg:mt-2 mt-14 relative px-4  z-30 w-full  flex-col py-4 bg-zinc-200 dark:bg-gray-600  rounded-md   `}
        >
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
            <div className="text-left">
              <a
                onClick={handleCloseCreateWalletForm}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                <span className="relative px-5 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Close
                </span>
              </a>
            </div>
            <div className="text-center justify-center overflow-hidden">
              <p className="text-2xl font-medium text-gray-900 dark:text-white">
                Wallet
              </p>
            </div>
            <div className="text-right">
              <button
                onClick={() =>
                  handleWalletFormSubmit(
                    isEditFrom,
                    isEditFrom ? "delete" : "Save"
                  )
                }
                className={
                  isEditFrom
                    ? "relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-600 to-orange-900 group-hover:from-purple-600 group-hover:to-red-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-red-500 dark:focus:ring-red-800 group-invalid:pointer-events-none group-invalid:opacity-30"
                    : "relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 group-invalid:pointer-events-none group-invalid:opacity-30"
                }
              >
                <span className="relative px-5 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  {isEditFrom ? "Delete" : "Save"}
                </span>
              </button>
            </div>
          </div>
          {/* TODO: INPUT FIELD */}
          <div className=" relative mb-5">
            <label
              htmlFor="large-input"
              className="flex items-center  mb-2 text-base font-medium text-gray-900 dark:text-white"
            >
              Wallet Name*
              <input
                id="inline-checkbox"
                type="checkbox"
                checked={formWalletData.is_default_wallet}
                onChange={() =>
                  setFormWalletData({
                    ...formWalletData,
                    is_default_wallet: !formWalletData.is_default_wallet,
                  })
                }
                className="w-5 h-5 ml-24 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="inline-checkbox"
                className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300"
              >
                Make default
              </label>
            </label>
            <input
              onChange={handleWalletFormChange}
              value={formWalletData.wallet_name}
              required
              ref={inputFocusRef}
              type="text"
              maxLength={40}
              name="wallet_name"
              className="text-base bg-gray-50 border-2 border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer "
            />

            <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
              Please enter Wallet Name!
            </span>
          </div>
          <div className=" relative mb-5">
            <label
              htmlFor="Large input 2"
              className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
            >
              Wallet Balance
            </label>

            <input
              type="text"
              onChange={handleWalletFormChange}
              value={currencyFormatter(formWalletData.wallet_balance)}
              inputMode="numeric"
              name="wallet_balance"
              className="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            />
          </div>
          <div className=" relative mb-5">
            <label
              htmlFor="large-input"
              className="text-base block mb-2  font-medium text-gray-900 dark:text-white"
            >
              Wallet Description
            </label>
            <input
              onChange={handleWalletFormChange}
              type="text"
              name="wallet_description"
              value={formWalletData.wallet_description}
              maxLength={40}
              className="text-base bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="text-center">
            <button
              onClick={() => handleWalletFormSubmit(isEditFrom, "submit")}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 group-invalid:pointer-events-none group-invalid:opacity-30"
            >
              <span className="text-lg relative px-12 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                {isEditFrom ? "Edit" : "Save"}
              </span>
            </button>
          </div>
        </form>
      </fieldset>
      <div
        className="fixed top-0 right-0 bottom-0 left-0 z-27 bg-black/20"
        onClick={() => {
          isShowCreateWalletForm(false);
        }}
      ></div>
    </>
  );
}
