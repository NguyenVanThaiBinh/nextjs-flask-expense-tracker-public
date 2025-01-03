import React, { useEffect, useRef, useState } from "react";
import currencyFormatter, {
  convertToCurrency,
  isAlphabetic,
} from "../Function/workWithCurrency";
import { BiChevronRight } from "react-icons/bi";
import Calendar from "react-calendar";
import convertToYMD, { reverseDateToFormat } from "../Function/workWithDate";
import WalletDropdownSelectItem from "../Dropdown/WalletDropdownSelectItem";
import CategorySelectForm from "./CategorySelectForm";
import BoldLine from "../Line/BoldLine";
import { toast } from "react-toastify";
import {
  handleApiErrorPromiseAndRemoveLocalstorage,
  showToastErrorContent,
} from "../Function/workWithApiError";
import axios from "axios";

import { FormExpenseDataType } from "../ObjectType/ExpenseType";
import { FormWalletDataType } from "../ObjectType/WalletType";
import isDeepEqualObject from "../Function/workWithObject";

export default function ExpenseForm({
  isShowExpenseForm,
  expenseData,
  dateValueProps,
}: {
  isShowExpenseForm: any;
  expenseData: FormExpenseDataType;
  dateValueProps: any;
}) {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------
  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece] | string;

  const [isDisable, setIsDisable] = useState(false);
  const [isShowCalendar, setIsShowCalendar] = useState(false);
  const [isShowWalletList, setIsShowWalletList] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isShowCategorySelectForm, setIsShowCategorySelectForm] =
    useState(false);
  const selectedMonth = useRef<number>(new Date().getMonth() + 1);
  const selectedYear = useRef<number>(new Date().getFullYear());
  const [calendarValue, setCalendarValue] = useState<Value>();
  const [formExpenseData, setFormExpenseData] = useState<FormExpenseDataType>({
    expense_id: null,
    category_id: null,
    category_name: "",
    icon: "",
    wallet_id: 0,
    wallet_name: null,
    expense_amount: 0,
    expense_created_at: convertToYMD(dateValueProps),
    expense_description: "",
    del_flag: false,
    type_category: "expense",
  });

  const checkExpenseData = useRef<FormExpenseDataType>({
    expense_id: null,
    category_id: null,
    category_name: "",
    icon: "",
    wallet_id: 0,
    wallet_name: null,
    expense_amount: 0,
    expense_created_at: convertToYMD(dateValueProps),
    expense_description: "",
    del_flag: false,
    type_category: "expense",
  });
  const balanceInputValueRef = useRef("0");

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const handleChangeCategory = (type: string) => {
    if (type === "expense") {
      setChangeCategory("Eating");
    } else {
      setChangeCategory("Salary");
    }
  };

  const setChangeCategory = (category: string) => {
    let categoryDataLocal = JSON.parse(localStorage.getItem("category") as any);
    if (categoryDataLocal && categoryDataLocal.length > 0) {
      let defaultCategory = categoryDataLocal.filter(
        (item: any) => item.category_name.trim() === category
      );
      if (!defaultCategory || defaultCategory.length === 0) {
        defaultCategory[0] = categoryDataLocal[0];
      }

      setFormExpenseData({
        ...formExpenseData,
        ["category_id"]: defaultCategory[0].category_id,
        ["category_name"]: defaultCategory[0].category_name,
        ["icon"]: defaultCategory[0].icon,
        ["type_category"]: defaultCategory[0].type_category,
      });
    }
  };

  const handleExpenseFormChange = (event: any) => {
    if (event.target.name === "expense_amount") {
      if (isAlphabetic(event.target.value)) {
        return;
      }

      let expense_amount = convertToCurrency(
        event.target.value,
        balanceInputValueRef.current
      );

      if (Number.isNaN(expense_amount)) {
        expense_amount = 0;
        setFormExpenseData({
          ...formExpenseData,
          ["expense_amount"]: 0,
        });
      }

      balanceInputValueRef.current = expense_amount.toString();

      setFormExpenseData({
        ...formExpenseData,
        ["expense_amount"]: expense_amount,
      });
      return;
    }

    setFormExpenseData({
      ...formExpenseData,
      [event.target.name]: event.target.value,
    });
  };

  const handleCalendarOnChange = (value: any) => {
    setCalendarValue(value);
    setFormExpenseData({
      ...formExpenseData,
      ["expense_created_at"]: convertToYMD(value),
    });
    setIsShowCalendar(false);
  };

  const handleChangeCategoryFromChild = (categoryData: any) => {
    setIsShowCategorySelectForm(false);
    setFormExpenseData({
      ...formExpenseData,
      ["category_id"]: categoryData.category_id,
      ["category_name"]: categoryData.category_name,
      ["icon"]: categoryData.icon,
    });
  };

  const handleWalletListFromChild = (
    isShowWalletList: boolean,
    walletData: any
  ) => {
    setIsShowWalletList(isShowWalletList);
    if (walletData && walletData.wallet_id !== 0) {
      setFormExpenseData({
        ...formExpenseData,
        ["wallet_name"]: walletData.wallet_name,
        ["wallet_id"]: walletData.wallet_id,
      });
    }
  };
  const validateDataExpense = (expenseData: FormExpenseDataType) => {
    if (expenseData.expense_amount <= 0) {
      showToastErrorContent("Amount must be greater than zero!");
      return false;
    }
    if (!expenseData.category_id) {
      showToastErrorContent("Please select category!");
      return false;
    }
    if (!expenseData.wallet_id) {
      showToastErrorContent("Please create wallet!");
      return false;
    }
    // Check for update only if category data has changed
    if (
      isEditMode &&
      checkExpenseData.current &&
      isDeepEqualObject(formExpenseData, checkExpenseData.current)
    ) {
      showToastErrorContent("Nothing to update !");
      return false;
    }
    if (
      isEditMode &&
      formExpenseData.type_category !==
        checkExpenseData.current.type_category &&
      formExpenseData.category_id === checkExpenseData.current.category_id
    ) {
      showToastErrorContent("Nothing to update !");
      return false;
    }
    return true;
  };
  const createUpdateExpenseDate = async (isEditMode: boolean) => {
    if (!validateDataExpense(formExpenseData)) return;
    setIsDisable(true);
    try {
      const toastPromise = toast.promise(
        axios.post("/api/expense/insertUpdateExpense", formExpenseData, {
          headers: {
            Authorization: localStorage.getItem("jwt_token"),
          },
        }),
        {
          pending: {
            render() {
              return getPendingMessage(isEditMode);
            },
          },
          success: {
            render({ data }) {
              const newExpense = data.data.new_expense;
              updateLocalStorageExpense(newExpense, isEditMode);
              balanceInputValueRef.current = "0";
              if (isEditMode) {
                isShowExpenseForm(false, false, newExpense.expense_created_at);
              } else {
                isShowExpenseForm(false, true, newExpense.expense_created_at);
              }
              setTimeout(() => {
                setIsDisable(false);
              }, 1500);

              return getSuccessMessage(isEditMode);
            },
          },
          error: {
            render({ data }) {
              return handleApiErrorPromiseAndRemoveLocalstorage(data);
            },
          },
        }
      );

      await toastPromise;

      checkExpenseData.current = formExpenseData;
    } catch (error) {}
    setIsDisable(false);
    isShowExpenseForm(true, true, formExpenseData.expense_created_at);
    return;
  };

  function updateLocalStorageExpense(
    newExpense: FormExpenseDataType,
    isEditMode: boolean
  ) {
    newExpense.category_name = formExpenseData.category_name;
    newExpense.icon = formExpenseData.icon;
    newExpense.type_category = formExpenseData.type_category;
    let existingExpense = JSON.parse(
      localStorage.getItem(
        "expense_" + selectedYear.current + selectedMonth.current
      ) || "[]"
    );
    let balanceAmountEditMode: number = 0;
    if (existingExpense.length > 0 && isEditMode) {
      const indexOfElementBeforeEdit = existingExpense.findIndex(
        (expenseElement: any) =>
          expenseElement.expense_id === newExpense.expense_id
      );

      //Update wallet balance
      if (
        newExpense.type_category ===
        existingExpense[indexOfElementBeforeEdit].type_category
      ) {
        if (
          Number(existingExpense[indexOfElementBeforeEdit].expense_amount) <=
          Number(newExpense.expense_amount)
        ) {
          balanceAmountEditMode = Math.abs(
            Number(existingExpense[indexOfElementBeforeEdit].expense_amount) -
              Number(newExpense.expense_amount)
          );
        } else {
          balanceAmountEditMode =
            -1 *
            Math.abs(
              Number(existingExpense[indexOfElementBeforeEdit].expense_amount) -
                Number(newExpense.expense_amount)
            );
        }
      }
      //Different
      if (
        newExpense.type_category !==
        existingExpense[indexOfElementBeforeEdit].type_category
      ) {
        balanceAmountEditMode =
          Number(existingExpense[indexOfElementBeforeEdit].expense_amount) +
          Number(newExpense.expense_amount);
      }

      existingExpense = existingExpense.filter(
        (expenseElement: any) =>
          expenseElement.expense_id !== newExpense.expense_id
      );
      if (newExpense.del_flag === false) {
        existingExpense.splice(indexOfElementBeforeEdit, 0, newExpense);
      }
    }

    if (isEditMode === false) {
      existingExpense.push(newExpense);
    }
    localStorage.setItem(
      "expense_" + selectedYear.current + selectedMonth.current,
      JSON.stringify(existingExpense)
    );

    updateWalletLocalStorage(newExpense, balanceAmountEditMode);

    if (isEditMode === false) {
      if (formExpenseData.type_category === "expense") {
        setDefaultWalletCategory("Eating");
      } else {
        setDefaultWalletCategory("Salary");
      }

      checkExpenseData.current = {
        ...formExpenseData,
        expense_id: null,
        expense_amount: 0,
        expense_created_at:
          (dateValueProps && convertToYMD(dateValueProps)) ||
          convertToYMD(new Date()),
        expense_description: "",
        del_flag: false,
      };
    }
  }
  function updateWalletLocalStorage(
    newExpense: FormExpenseDataType,
    balanceAmountEditMode?: number
  ) {
    let selectedWalletIndex = -1;
    let walletDataLocal: FormWalletDataType[] = JSON.parse(
      localStorage.getItem("wallet") as any
    );
    for (let i = 0; i < walletDataLocal.length; i++) {
      if (walletDataLocal[i].wallet_id === newExpense.wallet_id) {
        selectedWalletIndex = i;
        break;
      }
    }
    if (selectedWalletIndex !== -1 && balanceAmountEditMode !== undefined) {
      if (balanceAmountEditMode != 0) {
        if (newExpense.type_category === "expense") {
          walletDataLocal[selectedWalletIndex].wallet_balance =
            Number(walletDataLocal[selectedWalletIndex].wallet_balance) -
            Number(balanceAmountEditMode);
        } else {
          walletDataLocal[selectedWalletIndex].wallet_balance =
            Number(walletDataLocal[selectedWalletIndex].wallet_balance) +
            Number(balanceAmountEditMode);
        }
      } else {
        if (newExpense.type_category === "expense") {
          walletDataLocal[selectedWalletIndex].wallet_balance =
            Number(walletDataLocal[selectedWalletIndex].wallet_balance) -
            Number(newExpense.expense_amount);
        } else {
          walletDataLocal[selectedWalletIndex].wallet_balance =
            Number(walletDataLocal[selectedWalletIndex].wallet_balance) +
            Number(newExpense.expense_amount);
        }
      }

      updateWalletToDB(walletDataLocal[selectedWalletIndex]);

      localStorage.setItem("wallet", JSON.stringify(walletDataLocal));
    }
  }

  function updateWalletToDB(walletData: FormWalletDataType) {
    try {
      axios.post("/api/wallet/insertUpdateWallet", walletData, {
        headers: {
          Authorization: localStorage.getItem("jwt_token"),
        },
      });
    } catch (error: any) {
      return handleApiErrorPromiseAndRemoveLocalstorage(error);
    }
  }

  function getPendingMessage(isEditMode: boolean) {
    return isEditMode ? "Editing Expense..." : "Creating new Expense...";
  }

  function getSuccessMessage(isEditMode: boolean) {
    return isEditMode
      ? "Edit Expense successfully"
      : "Add Expense successfully!";
  }
  const setDefaultWalletCategory = (defaultCategoryName: string) => {
    let walletDataLocal = JSON.parse(localStorage.getItem("wallet") as any);
    let categoryDataLocal = JSON.parse(localStorage.getItem("category") as any);
    let tempExpenseData: FormExpenseDataType = {
      expense_id: null,
      category_id: null,
      category_name: "",
      icon: "",
      wallet_id: 0,
      wallet_name: null,
      expense_amount: 0,
      expense_created_at:
        (formExpenseData.expense_created_at &&
          convertToYMD(Date.parse(formExpenseData.expense_created_at))) ||
        (dateValueProps && convertToYMD(dateValueProps)) ||
        convertToYMD(new Date()),
      expense_description: "",
      del_flag: false,
      type_category: "expense",
    };
    if (categoryDataLocal && categoryDataLocal.length > 0) {
      let defaultCategory = categoryDataLocal.filter(
        (item: any) => item.category_name.trim() === defaultCategoryName
      );

      if (!defaultCategory || defaultCategory.length === 0) {
        defaultCategory[0] = categoryDataLocal[0];
      }

      tempExpenseData.type_category = defaultCategory[0].type_category;
      tempExpenseData.category_id = defaultCategory[0].category_id;
      tempExpenseData.category_name = defaultCategory[0].category_name;
      tempExpenseData.icon = defaultCategory[0].icon;
    }
    if (walletDataLocal && walletDataLocal.length > 0) {
      tempExpenseData.wallet_name = walletDataLocal[0].wallet_name;
      tempExpenseData.wallet_id = walletDataLocal[0].wallet_id;
      setFormExpenseData(tempExpenseData);
    } else {
      showToastErrorContent("Please create wallet!");
      return;
    }
  };
  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    //date
    if (dateValueProps) {
      selectedYear.current = parseInt(
        reverseDateToFormat(convertToYMD(dateValueProps), "Y")
      );
      selectedMonth.current = parseInt(
        reverseDateToFormat(convertToYMD(dateValueProps), "M")
      );
    }
    setDefaultWalletCategory("Eating");
  }, []);
  useEffect(() => {
    //For edit mode
    if (expenseData && expenseData.category_name) {
      formExpenseData.expense_created_at = convertToYMD(
        Date.parse(expenseData.expense_created_at) || convertToYMD(new Date())
      );

      let convertedDate = convertToYMD(
        Date.parse(expenseData.expense_created_at)
      );
      expenseData.expense_created_at = convertedDate;
      let walletDataLocal = JSON.parse(localStorage.getItem("wallet") as any);
      let walletElement = null;
      for (let i = 0; i < walletDataLocal.length; i++) {
        if (walletDataLocal[i].wallet_id === expenseData.wallet_id) {
          walletElement = walletDataLocal[i];
          break; // Exit the loop after finding the first match
        }
      }
      if (walletElement) expenseData.wallet_name = walletElement.wallet_name;
      checkExpenseData.current = expenseData;
      setFormExpenseData(expenseData);
      setIsEditMode(true);
    }
  }, []);

  return (
    <>
      <fieldset disabled={isDisable}>
        <form className=" relative -mt-14 px-4   z-30 w-full  flex-col py-4 bg-zinc-200 dark:bg-gray-600  rounded-md flex  ">
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
            <div className="text-left">
              <a
                onClick={() =>
                  isShowExpenseForm(
                    false,
                    false,
                    formExpenseData.expense_created_at
                  )
                }
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                <span className="relative px-5 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Close
                </span>
              </a>
            </div>
            <div className="text-center justify-center overflow-hidden">
              <p className="text-2xl font-medium text-gray-900 dark:text-white">
                Note
              </p>
            </div>
            <div className="text-right">
              <a
                onClick={() => {
                  createUpdateExpenseDate(isEditMode);
                }}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                <span className="relative px-5 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  {isEditMode ? "Edit" : "Save"}
                </span>
              </a>
            </div>
          </div>
          <BoldLine></BoldLine>
          {/* Expense or Earning category */}
          <div
            className="flex my-2  rounded-md shadow-sm justify-center "
            role="group"
          >
            <button
              type="button"
              onClick={() => handleChangeCategory("expense")}
              className={` ${
                formExpenseData.type_category === "expense"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-900"
              } px-14 py-2 text-sm font-medium   border border-gray-200 rounded-s-md focus:bg-red-600  focus:z-10 focus:ring-2  focus:ring-white focus:text-white `}
            >
              Expense
            </button>

            <button
              type="button"
              onClick={() => handleChangeCategory("earnings")}
              className={` ${
                formExpenseData.type_category === "earnings"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-900"
              } px-14 py-2 text-sm font-medium   border border-gray-200 rounded-e-md focus:bg-green-600  focus:z-10 focus:ring-2  focus:ring-white focus:text-white  `}
            >
              Earnings
            </button>
          </div>

          {/* TODO: INPUT FIELD */}
          <div className="flex relative mt-4 mb-5">
            <label
              htmlFor="large-input"
              className="flex text-center mr-6 text-2xl items-center font-medium text-gray-900 dark:text-white"
            >
              Amount
            </label>
            <input
              type="text"
              onChange={handleExpenseFormChange}
              value={currencyFormatter(formExpenseData.expense_amount)}
              inputMode="numeric"
              name="expense_amount"
              className="h-10 flex text-center   items-center text-xl bg-gray-50 border  border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            />
          </div>
          <div className=" relative mb-3">
            <button
              onClick={() => setIsShowCategorySelectForm(true)}
              type="button"
              className="grid grid-cols-12 w-full text-white bg-gray-400 hover:bg-[#6e747d] focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium rounded-md text-sm px-3 py-2.5 text-center me-2 mb-2 items-center "
            >
              <div className="col-span-4 text-left ">
                {formExpenseData.type_category === "expense"
                  ? "Expense type:"
                  : "Earnings type:"}
              </div>
              <div className="col-span-8 flex justify-end">
                <span className="min-w-[8rem;] max-w-[12rem;] items-start justify-start text-left text-base font-medium whitespace-nowrap overflow-x-auto">
                  {formExpenseData.category_name}
                </span>
                <BiChevronRight
                  style={{
                    fontSize: "25px",
                  }}
                />
              </div>
            </button>
          </div>
          <div className=" relative mb-3">
            <button
              type="button"
              onClick={() => setIsShowCalendar(true)}
              className="grid grid-cols-12 w-full text-white bg-[#496088] hover:bg-[#2665d1] focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium rounded-md text-sm px-3 py-2.5 text-center me-2 mb-2 items-center "
            >
              <div className="col-span-4 text-left ">Date:</div>
              <div className="col-span-8 flex justify-end">
                <span className="min-w-[8rem;] max-w-[12rem;] items-start justify-start text-left text-base font-medium whitespace-nowrap overflow-x-auto">
                  {reverseDateToFormat(formExpenseData.expense_created_at, "")}
                </span>
                <BiChevronRight
                  style={{
                    fontSize: "25px",
                  }}
                />
              </div>
            </button>
          </div>
          <div className=" relative mb-3">
            <button
              onClick={() => setIsShowWalletList(true)}
              type="button"
              className="grid grid-cols-12 w-full text-white bg-[#516e9f] hover:bg-[#3976dd] focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium rounded-md text-sm px-3 py-2.5 text-center me-2 mb-2 items-center "
            >
              <div className="col-span-4 text-left ">
                {formExpenseData.type_category === "expense"
                  ? "From wallet:"
                  : "To wallet:"}
              </div>
              <div className="col-span-8 flex justify-end">
                <span className="min-w-[8rem;] max-w-[12rem;] items-start justify-start text-left text-base font-medium whitespace-nowrap overflow-x-auto">
                  {formExpenseData.wallet_name}
                </span>
                <BiChevronRight
                  style={{
                    fontSize: "25px",
                  }}
                />
              </div>
            </button>
            {isShowWalletList && (
              <WalletDropdownSelectItem
                isShowWalletListProps={isShowWalletList}
                handleClick={handleWalletListFromChild}
              ></WalletDropdownSelectItem>
            )}
          </div>

          <div className=" relative mb-3">
            <input
              placeholder="Note here"
              type="text"
              value={formExpenseData.expense_description}
              onChange={(e: any) => {
                setFormExpenseData({
                  ...formExpenseData,
                  ["expense_description"]: e.target.value,
                });
              }}
              id="Large input 4"
              maxLength={30}
              className="text-base bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="text-center">
            <a
              onClick={() => {
                createUpdateExpenseDate(isEditMode);
              }}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="text-lg relative px-12 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                {isEditMode ? "Edit" : "Save"}
              </span>
            </a>
          </div>
        </form>
      </fieldset>
      {isShowCalendar && (
        <Calendar
          onChange={(value) => {
            handleCalendarOnChange(value);
          }}
          value={calendarValue}
          className={"absolute mt-[-17rem;] z-50 "}
        ></Calendar>
      )}
      {isShowCalendar || isShowCategorySelectForm ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-30 bg-black/20"
          onClick={() => {
            setIsShowCalendar(false);
            setIsShowCategorySelectForm(false);
          }}
        ></div>
      ) : (
        <></>
      )}
      {isShowCategorySelectForm && (
        <CategorySelectForm
          isShowCategoryForm={() => setIsShowCategorySelectForm(false)}
          handleClick={handleChangeCategoryFromChild}
          expenseOrEarningsProps={formExpenseData.type_category}
        ></CategorySelectForm>
      )}
    </>
  );
}
