"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import LoginButton from "./components/Button/LoginButton";
import TopNavBar from "./components/NavBar/TopNavBar";
import BottomNavBar from "./components/NavBar/BottomNavBar";
import HomePage from "./components/HomePage/HomePage";
import handleApiErrorAndRemoveLocalstorage, {
  handleApiErrorPromiseAndRemoveLocalstorage,
} from "./components/Function/workWithApiError";
import fetchDataWithEndPoint from "./components/Function/workWithFetchData";
import Loading from "./components/Effect/Loading";
import { setTimeout } from "timers";
export default function Home() {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------
  const [userData, setUserData] = useState<any>(null);
  const [showMainComponent, setShowMainComponent] = useState(false);
  const [mountComponentIndex, setMountComponentIndex] = useState("note");
  const [welcomeBackString, setWelcomeBackString] = useState("Hi, ");
  // const isChangeTransferForm = useRef<boolean>(false);
  const [isChangeTransferForm, setIsChangeTransferForm] = useState(false);

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const handleOnClickFromChild = (typeComponent: string) => {
    setMountComponentIndex(typeComponent);
  };

  async function fetchAndSetLocalStorage() {
    let walletData = await fetchDataWithEndPoint(
      "/api/wallet/getWalletByEmail"
    );
    if (walletData === "error") {
      return;
    }
    if (walletData !== null) {
      localStorage.setItem("wallet", JSON.stringify(walletData));
    }

    let categoryData = await fetchDataWithEndPoint(
      "/api/category/getCategoryByEmail",
      ""
    );

    if (categoryData !== null) {
      localStorage.setItem("category", JSON.stringify(categoryData));
    }
  }
  function getMonthRange(countAfter: number) {
    const result = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed

    for (let i = 0; i >= -countAfter; i--) {
      let year = currentYear;
      let month = currentMonth + i;
      if (month > 12) {
        year++;
        month -= 12;
      } else if (month <= 0) {
        year--;
        month += 12;
      }

      result.push(`${year},${month}`);
    }

    return result;
  }
  const getExpenseDataMonth = async () => {
    let monthYearRange = getMonthRange(5);
    if (monthYearRange) {
      try {
        for (let i = 0; i < monthYearRange.length; i++) {
          const response = await fetchDataWithEndPoint(
            "/api/expense/getExpenseByEmail",
            {
              Month: monthYearRange[i].split(",")[1],
              Year: monthYearRange[i].split(",")[0],
            }
          );

          if (response !== null) {
            localStorage.setItem(
              "expense_" +
                monthYearRange[i].split(",")[0] +
                monthYearRange[i].split(",")[1],
              JSON.stringify(response)
            );
          } else {
            localStorage.setItem(
              "expense_" +
                monthYearRange[i].split(",")[0] +
                monthYearRange[i].split(",")[1],
              JSON.stringify([])
            );
          }
        }
      } catch (error: any) {
        return handleApiErrorPromiseAndRemoveLocalstorage(error);
      }
    }
  };
  const handleIsChangeTransferForm = (isChangeTransferFormProps: any) => {
    if (isChangeTransferFormProps) {
      setTimeout(() => {
        setIsChangeTransferForm(isChangeTransferFormProps);
      }, 5000);
    }
  };
  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    const fetchTextAi = async () => {
      const text_ai = await fetchDataWithEndPoint("/api/gemini/generate", "");
      if (text_ai) {
        localStorage.setItem("text_ai", text_ai.result);
      }
    };
    const fetchUserDataAndLoadData = async () => {
      try {
        const response = await axios.get("/api/getUserInfo");

        if (response.data !== null) {
          const email = response.data.email;

          setUserData(response.data);

          localStorage.setItem("jwt_token", response.data.jwt_token);
          localStorage.setItem("isVN_language", response.data.isVN_language);
          localStorage.setItem(
            "default_wallet_id",
            response.data.default_wallet_id
          );

          let isInsertedUser = localStorage.getItem(email);

          if (isInsertedUser !== "inserted") {
            insertUserExpenseToDB(email, response.data.jwt_token);
            fetchAndSetLocalStorage();
            setTimeout(() => {
              setShowMainComponent(true);
            }, 2500);
          } else {
            setWelcomeBackString("Welcome back, ");
            fetchAndSetLocalStorage();
            setTimeout(() => {
              setShowMainComponent(true);
            }, 1500);
          }
          fetchTextAi();
          getExpenseDataMonth();
        } else {
          localStorage.clear();
        }
      } catch (error: any) {
        console.error(error);
      }
    };

    const insertUserExpenseToDB = async (
      userEmail: string,
      jwt_token: string
    ) => {
      try {
        const response = await axios.post(
          "/api/userExpense/insertUserExpense",
          "",
          {
            headers: {
              Authorization: jwt_token,
            },
          }
        );

        if (response && response.status === 200) {
          if (response.data.result === "inserted user") {
            setWelcomeBackString("Welcome back, ");
          }
          localStorage.setItem(userEmail, "inserted");
        }
      } catch (error: any) {
        handleApiErrorAndRemoveLocalstorage(error);
      }
    };

    fetchUserDataAndLoadData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-12">
        <div className={"lg:col-span-4"}></div>
        <div className={"lg:col-span-4 col-span-12"}>
          <div className="h-screen  bg-gradient-to-tl from-green-400 to-indigo-900 w-full  ">
            {showMainComponent ? (
              <div className={"fixed  top-0 left-0 w-full lg:contents"}>
                <TopNavBar
                  UserInfo={userData}
                  isChangeTransferForm={handleIsChangeTransferForm}
                />
                <HomePage
                  mountComponentIndexProps={mountComponentIndex}
                  userExpenseEmailProps={userData.email}
                  isChangeTransferFormProps={isChangeTransferForm}
                ></HomePage>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <img
                    className="focus:outline-none rounded-full"
                    width="85"
                    height="70"
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    src={userData !== null ? userData.picture : "/Icon.jpg"}
                  ></img>

                  <p className="text-3xl  py-2 font-semibold text-yellow-300 ">
                    Expense Management
                  </p>
                </div>
                <div>
                  {userData !== null ? (
                    <div>
                      <div className=" flex flex-col items-center justify-center bg-white  rounded  w-full p-4  mt-16 ">
                        <p className="dark:text-black text-base  py-2 font-semibold dis  ">
                          {welcomeBackString + userData.name + " !"}
                        </p>
                        <div className=" py-4 font-semibold  ">
                          <Loading></Loading>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <LoginButton></LoginButton>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          {showMainComponent && (
            <BottomNavBar handleClick={handleOnClickFromChild} />
          )}
        </div>
      </div>
      <div className={"lg:col-span-4"}></div>
    </>
  );
}
