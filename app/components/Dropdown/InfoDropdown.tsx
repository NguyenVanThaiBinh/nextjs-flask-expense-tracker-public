import React, { useEffect, useRef, useState } from "react";
import "../../css/Button.css";
import { GoFilter } from "react-icons/go";
import { isConfirmChangeLanguageAlert } from "../Function/workWithAlert";
import axios from "axios";
import handleApiErrorAndRemoveLocalstorage, {
  showToastErrorContent,
} from "../Function/workWithApiError";
import Loading from "../Effect/Loading";
import fetchDataWithEndPoint from "../Function/workWithFetchData";

export default function Dropdown({ UserInfo }: { UserInfo: any }) {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------

  const [showLoadingComponent, setShowLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isVNTypeMoney, setIsVNTypeMoney] = useState<boolean>(true);
  const checkIsVNTypeMoney = useRef<boolean>(true);

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const toggle = async () => {
    setIsOpen((old) => !old);
    console.log(isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
  };

  const handleExportCSV = async () => {
    try {
      setShowLoading(true);
      toggle();
      const response = await fetchDataWithEndPoint("/api/export/exportCSV");

      if (response === null) {
        showToastErrorContent("Nothing data to export!");
        setShowLoading(false);
        return;
      }

      const blob = new Blob([await response], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exported_data.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setShowLoading(false);
    } catch (error: any) {
      setShowLoading(false);
      handleApiErrorAndRemoveLocalstorage(error);
    }
  };
  const transClass = isOpen ? "flex" : "hidden";

  const confirmChangeLanguage = async () => {
    if (!isOpen && checkIsVNTypeMoney.current !== isVNTypeMoney) {
      if (await isConfirmChangeLanguageAlert()) {
        localStorage.setItem("isVN_language", isVNTypeMoney.toString());
        checkIsVNTypeMoney.current = isVNTypeMoney;
        setShowLoading(true);
        await updateUserExpenseAndBalanceToDB(isVNTypeMoney);

        Object.keys(localStorage).forEach(function (key) {
          if (/^expense_/.test(key)) {
            localStorage.removeItem(key);
          }
        });
        localStorage.removeItem("wallet");
        setShowLoading(false);

        window.location.href = "/";
      } else {
        setIsVNTypeMoney(checkIsVNTypeMoney.current);
      }
    }
  };
  const updateUserExpenseAndBalanceToDB = async (isVN_language: boolean) => {
    try {
      await axios.post(
        "/api/userExpense/updateLanguageUserExpense",
        { isVN_language: isVN_language },
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
  confirmChangeLanguage();
  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    let userLanguage = localStorage.getItem("isVN_language");
    if (userLanguage && userLanguage === "false") {
      setIsVNTypeMoney(false);
      checkIsVNTypeMoney.current = false;
    }
  }, []);
  return (
    <>
      <div className="relative">
        <button
          className="w-full text-white border border-green-50 m-1 p-1 font-medium  text-sm  text-center  items-center space-x-3 grid grid-cols-12"
          onClick={toggle}
        >
          <div className="col-span-10 flex">
            <img
              src={UserInfo.picture}
              className="h-12 rounded-full"
              alt="User Avatar"
              referrerPolicy="no-referrer"
            />
            <span className="pl-1 self-center text-sm font-semibold whitespace-nowrap overflow-x-auto">
              {UserInfo.name}
            </span>
          </div>
          <div className="col-span-2 flex">
            <GoFilter style={{ fontSize: "22px", textAlign: "right" }} />
          </div>
        </button>
        <div
          className={`absolute left-0 top-16 z-30 w-[200px] min-h-[100px] flex flex-col py-4 bg-zinc-50 rounded-md  dark:bg-slate-500 dark:text-white ${transClass}`}
        >
          <a
            key={2}
            className="hover:bg-zinc-300 hover:text-zinc-500 px-2 py-1"
            href={"#"}
          >
            <label className="inline-flex justify-center items-center cursor-pointer">
              <span className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">
                VND
              </span>
              <img className="w-7 mr-3" src="/vietnam_flag.png" alt="Japan" />
              <input
                type="checkbox"
                checked={!isVNTypeMoney}
                onChange={() => {
                  setIsVNTypeMoney((old) => !old);
                }}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                JP
              </span>
              <img className="w-7" src="/japan_flag.png" alt="Japan" />
            </label>
          </a>
          <button
            key={3}
            className="flex  justify-center   hover:bg-zinc-300 hover:text-zinc-500 px-4 py-1 "
            onClick={handleExportCSV}
          >
            Export CSV
          </button>
          <a
            key={1}
            className="flex  justify-center   hover:bg-zinc-300 hover:text-zinc-500 px-4 py-1 "
            href="/api/logout"
            onClick={handleLogout}
          >
            Logout App
          </a>
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
      {showLoadingComponent && (
        <div className=" fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/20">
          <div className=" fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <Loading></Loading>
          </div>
        </div>
      )}
    </>
  );
}
