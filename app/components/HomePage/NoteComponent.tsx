import React, { Fragment, useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "../../css/Calendar.css";
import ShowFormButton from "../Button/ShowFormButton";
import ExpenseForm from "../Form/ExpenseForm";
import { MdDeleteForever } from "react-icons/md";
import currencyFormatter from "../Function/workWithCurrency";
import fetchDataWithEndPoint from "../Function/workWithFetchData";
import { ConvertIconToJSX } from "../Icon/IconList";
import isDeleteConfirmAlert from "../Function/workWithAlert";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { handleApiErrorPromiseAndRemoveLocalstorage } from "../Function/workWithApiError";
import { FormExpenseDataType } from "../ObjectType/ExpenseType";
import convertToYMD, { reverseDateToFormat } from "../Function/workWithDate";
import Loading from "../Effect/Loading";
import { FormWalletDataType } from "../ObjectType/WalletType";
import { moveDefaultWalletFirst } from "./WalletComponent";

export default function NoteComponent() {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------
  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];

  const [value, onChange] = useState(new Date());
  const [isShowExpenseForm, setIsShowExpenseForm] = useState<boolean>(false);
  const [showLoadingComponent, setShowLoading] = useState(false);
  const [expenseMonthAmount, setExpenseMonthAmount] = useState(0);
  const [incomeMonthAmount, setIncomeMonthAmount] = useState(0);

  const [expenseDataList, setExpenseDataList] = useState<FormExpenseDataType[]>(
    []
  );
  const [formExpenseData, setFormExpenseData] = useState<FormExpenseDataType>({
    expense_id: null,
    category_id: null,
    category_name: "",
    icon: "",
    wallet_id: 0,
    wallet_name: null,
    expense_amount: 0,
    expense_created_at: convertToYMD(new Date()),
    expense_description: "",
    del_flag: false,
    type_category: "",
  });

  const selectedMonth = useRef<number>(new Date().getMonth() + 1);
  const selectedYear = useRef<number>(new Date().getFullYear());

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const handleCalendarChangeAndSetExpenseData = async (dateValue: Date) => {
    let expenseSum = 0;
    let incomeSum = 0;
    let expenseDataInDay: FormExpenseDataType[];
    if (
      (parseInt(reverseDateToFormat(convertToYMD(dateValue), "Y")) ===
        selectedYear.current &&
        parseInt(reverseDateToFormat(convertToYMD(dateValue), "M")) !==
          selectedMonth.current) ||
      parseInt(reverseDateToFormat(convertToYMD(dateValue), "Y")) !==
        selectedYear.current
    ) {
      selectedYear.current = parseInt(
        reverseDateToFormat(convertToYMD(dateValue), "Y")
      );
      selectedMonth.current = parseInt(
        reverseDateToFormat(convertToYMD(dateValue), "M")
      );
    }

    let expenseDataInMonth: FormExpenseDataType[] = JSON.parse(
      localStorage.getItem(
        "expense_" + selectedYear.current + selectedMonth.current
      ) as any
    );

    if (!expenseDataInMonth) {
      await checkExpenseData();
      expenseDataInMonth = JSON.parse(
        localStorage.getItem(
          "expense_" + selectedYear.current + selectedMonth.current
        ) as any
      );
    }

    if (expenseDataInMonth && expenseDataInMonth.length > 0 && dateValue) {
      expenseDataInDay = expenseDataInMonth.filter((expenseElement: any) => {
        let YMD = convertToYMD(expenseElement.expense_created_at);

        return YMD === convertToYMD(dateValue);
      });
      setExpenseDataList(expenseDataInDay);

      for (const item of expenseDataInMonth) {
        if (item.type_category === "expense") {
          expenseSum += Number(item["expense_amount"]);
        } else {
          incomeSum += Number(item["expense_amount"]);
        }
      }

      setExpenseMonthAmount(expenseSum);
      setIncomeMonthAmount(incomeSum);
    } else {
      setExpenseMonthAmount(0);
      setIncomeMonthAmount(0);
      setExpenseDataList([]);
    }

    onChange(dateValue);
  };

  const handleFromChildComponent = (
    isShowExpenseForm: boolean,
    isCreate: boolean,
    expense_created_at: string
  ) => {
    if (isCreate) {
      handleCalendarChangeAndSetExpenseData(new Date(expense_created_at));
      return;
    }
    if (isShowExpenseForm) {
      setFormExpenseData({
        expense_id: null,
        category_id: null,
        category_name: "",
        icon: "",
        wallet_id: 0,
        wallet_name: null,
        expense_amount: 0,
        expense_created_at: convertToYMD(new Date()),
        expense_description: "",
        del_flag: false,
        type_category: "",
      });
    }
    setIsShowExpenseForm(isShowExpenseForm);
  };

  const handleOnclickUpdateExpense = (expenseDate: FormExpenseDataType) => {
    setFormExpenseData(expenseDate);
    setIsShowExpenseForm(true);
  };

  const checkExpenseData = async () => {
    try {
      let expenseData = JSON.parse(
        localStorage.getItem(
          "expense_" + selectedYear.current + selectedMonth.current
        ) as any
      );

      if (!expenseData || expenseData.length === 0) {
        setShowLoading(true);
        const response = await fetchDataWithEndPoint(
          "/api/expense/getExpenseByEmail",
          { Month: selectedMonth.current, Year: selectedYear.current }
        );

        if (response !== null) {
          expenseData = response;
          localStorage.setItem(
            "expense_" + selectedYear.current + selectedMonth.current,
            JSON.stringify(response)
          );
        } else {
          localStorage.setItem(
            "expense_" + selectedYear.current + selectedMonth.current,
            JSON.stringify([])
          );
        }
      }

      setShowLoading(false);
    } catch (error: any) {
      return handleApiErrorPromiseAndRemoveLocalstorage(error);
    }
  };

  function updateLocalExpense(newExpense: FormExpenseDataType) {
    let existingExpense = JSON.parse(
      localStorage.getItem(
        "expense_" + selectedYear.current + selectedMonth.current
      ) || "[]"
    );
    if (existingExpense.length > 0) {
      existingExpense = existingExpense.filter(
        (expense: any) => expense.expense_id !== newExpense.expense_id
      );
    }

    localStorage.setItem(
      "expense_" + selectedYear.current + selectedMonth.current,
      JSON.stringify(existingExpense)
    );
  }
  function updateWalletDataBase(walletData: FormWalletDataType) {
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
  function updateWalletLocalVsDB(newExpense: FormExpenseDataType) {
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

    if (selectedWalletIndex === -1) {
      return;
    }
    if (newExpense.type_category === "expense") {
      walletDataLocal[selectedWalletIndex].wallet_balance += Number(
        newExpense.expense_amount
      );
    } else {
      walletDataLocal[selectedWalletIndex].wallet_balance -= Number(
        newExpense.expense_amount
      );
    }
    updateWalletDataBase(walletDataLocal[selectedWalletIndex]);

    localStorage.setItem("wallet", JSON.stringify(walletDataLocal));
  }

  const handleDeleteExpense = async (expenseData: FormExpenseDataType) => {
    if ((await isDeleteConfirmAlert()) === false) {
      return;
    }
    expenseData.del_flag = true;
    try {
      const toastPromise = toast.promise(
        axios.post("/api/expense/insertUpdateExpense", expenseData, {
          headers: {
            Authorization: localStorage.getItem("jwt_token"),
          },
        }),
        {
          pending: {
            render() {
              return "Deleting Expense...";
            },
          },
          success: {
            render({ data }) {
              const newExpense = data.data.new_expense;
              newExpense.type_category = expenseData.type_category;
              updateLocalExpense(newExpense);
              updateWalletLocalVsDB(newExpense);
              handleCalendarChangeAndSetExpenseData(value);
              return "Delete Expense successfully!";
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
    } catch (error) {}
  };
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;
    let sumExpense = 0;
    let sumEarning = 0;
    let currentYear = 0;
    let currentMonth = 0;
    currentYear = parseInt(reverseDateToFormat(convertToYMD(date), "Y"));
    currentMonth = parseInt(reverseDateToFormat(convertToYMD(date), "M"));
    let expenseDataInMonth: FormExpenseDataType[] = JSON.parse(
      localStorage.getItem("expense_" + currentYear + currentMonth) || "[]"
    );
    for (const item of expenseDataInMonth) {
      if (convertToYMD(item.expense_created_at) === convertToYMD(date)) {
        if (item.type_category === "expense") {
          sumExpense += Number(item.expense_amount);
        } else {
          sumEarning += Number(item.expense_amount);
        }
      }
    }
    if (sumEarning !== 0 || sumExpense !== 0) {
      return (
        <>
          {sumExpense !== 0 && (
            <div className="text-red-700 h-3">
              {"-" + currencyFormatter(sumExpense)}
            </div>
          )}
          {sumEarning !== 0 && (
            <div className="text-green-700 h-3">
              {"+" + currencyFormatter(sumEarning)}
            </div>
          )}
        </>
      );
    } else {
      return <></>;
    }
  };

  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    let text_ai = localStorage.getItem("text_ai") || null;
    if(text_ai !== null){
      toast.info(text_ai, {
        autoClose: 7000,
        position: "top-center",
      });
      localStorage.removeItem("text_ai");
    } 
      
    handleCalendarChangeAndSetExpenseData(new Date());

    moveDefaultWalletFirst();
  }, []);
  return (
    // <></>

    <>
      <ToastContainer autoClose={1500} limit={4}></ToastContainer>
      <div className="relative ">
        {isShowExpenseForm && (
          <ExpenseForm
            isShowExpenseForm={handleFromChildComponent}
            expenseData={formExpenseData}
            dateValueProps={value}
          />
        )}

        {isShowExpenseForm && (
          <div
            className="fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/20"
            onClick={() => setIsShowExpenseForm(false)}
          ></div>
        )}
      </div>
      <div
        className={
          isShowExpenseForm ? "hidden" : "flex text-center justify-center"
        }
      >
        <Calendar
          onChange={(e: any) => {
            handleCalendarChangeAndSetExpenseData(e);
          }}
          value={value}
          className={"w-full"}
          tileContent={tileContent}
        />
      </div>
      <div className="grid  grid-cols-12 bg-slate-400 max-h-7 text-xs min-h-7">
        <div className="col-span-3 font-bold ml-1 text-xs">
          {"At " + selectedMonth.current + " month:"}
        </div>
        <div className="flex col-span-4 font-bold text-red-700 text-left justify-center overflow-x-auto whitespace-nowrap">
          {"- " + currencyFormatter(expenseMonthAmount)}
        </div>
        <div className="flex col-span-5 font-bold text-green-700 text-left  justify-end mr-2 overflow-x-auto whitespace-nowrap">
          {"+ " + currencyFormatter(incomeMonthAmount)}
        </div>
      </div>
      {showLoadingComponent ? (
        <>
          <div className="mt-4">
            <Loading></Loading>
          </div>
        </>
      ) : (
        <>
          <div
            className={`${
              expenseDataList && expenseDataList.length > 0 ? "" : "hidden "
            }pt-1 justify-center bg-white overflow-scroll lg:overflow-auto  max-h-[15em;]`}
          >
            {!isShowExpenseForm &&
              expenseDataList &&
              expenseDataList.map((expenseElement: FormExpenseDataType) => (
                <div key={expenseElement.expense_id}>
                  {!expenseElement.del_flag && (
                    <>
                      <div className="grid grid-cols-12 mb-2">
                        <button
                          className="col-span-10  items-center justify-center"
                          key={expenseElement.expense_id}
                          onClick={() =>
                            handleOnclickUpdateExpense(expenseElement)
                          }
                        >
                          <div className="grid grid-cols-12">
                            <div className="col-span-7 ml-2 flex">
                              <div
                                style={{
                                  fontSize: "22px",
                                  color: "darkcyan",
                                  minWidth: "22px",
                                }}
                              >
                                {ConvertIconToJSX(expenseElement.icon)}
                              </div>

                              <span className=" ml-1 text-base font-medium text-cyan-600 whitespace-nowrap overflow-x-auto lg-overflow-x-hidden">
                                {expenseElement.category_name}
                                <span className="text-[0.7rem]">
                                  {expenseElement.expense_description &&
                                    expenseElement.expense_description.length <
                                      20 &&
                                    "(" +
                                      expenseElement.expense_description +
                                      ")"}
                                  {expenseElement.expense_description &&
                                    expenseElement.expense_description.length >=
                                      20 &&
                                    "(" +
                                      expenseElement.expense_description.slice(
                                        0,
                                        10
                                      ) +
                                      "...)"}
                                </span>
                              </span>
                            </div>

                            <div className="col-span-5 text-right  whitespace-nowrap overflow-x-auto  ">
                              {expenseElement.type_category === "expense" ? (
                                <div className="items-center justify-center font-bold text-red-700">
                                  {"- " +
                                    currencyFormatter(
                                      expenseElement.expense_amount
                                    )}
                                </div>
                              ) : (
                                <div className="items-center justify-center font-bold text-green-700 ">
                                  {"+ " +
                                    currencyFormatter(
                                      expenseElement.expense_amount
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                        <div className="col-span-2 text-2xl justify-center text-center text-red-600 ">
                          <button
                            onClick={() => handleDeleteExpense(expenseElement)}
                            className="flex   px-5"
                          >
                            <MdDeleteForever />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
      <div
        className={
          isShowExpenseForm
            ? "hidden"
            : "fixed top-[85%] left-1/2 transform -translate-y-1/2 -translate-x-1/2"
        }
      >
        <ShowFormButton isShowForm={handleFromChildComponent}></ShowFormButton>
      </div>
    </>
  );
}
