import React, { useEffect, useRef, useState } from "react";

export default function BottomNavBar({ handleClick }: { handleClick: any }) {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------
  const [typeButton, setTypeButton] = useState("note");

  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const handleOnclickRender = (typeComponent: string) => {
    setTypeButton(typeComponent);
    handleClick(typeComponent);
  };
  return (
    <nav className="fixed bottom-0 left-0 w-full ">
      <div className="max-w-screen-xl px-4 py-3 mx-auto">
        <div className="flex items-center justify-center text-center">
          <ul className="flex flex-row  font-medium mt-0 space-x-2 rtl:space-x-reverse text-sm">
            <li>
              <button
                onClick={() => handleOnclickRender("wallet")}
                className={`${
                  typeButton === "wallet"
                    ? " bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-cyan-200 hover:text-white"
                    : "bg-gradient-to-br from-cyan-500 to-blue-500"
                } relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium  rounded-lg group hover:text-white focus:outline-none `}
              >
                <span
                  className={`${
                    typeButton === "wallet"
                      ? "text-white"
                      : "text-gray-900 bg-white"
                  } font-bold relative px-7 py-2.5 transition-all ease-in duration-75   rounded-md group-hover:bg-opacity-0`}
                >
                  Wallet
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleOnclickRender("note")}
                className={`${
                  typeButton === "note"
                    ? " bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-cyan-200 hover:text-white"
                    : "bg-gradient-to-br from-cyan-500 to-blue-500"
                } relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group hover:text-white focus:outline-none `}
              >
                <span
                  className={`${
                    typeButton === "note"
                      ? "text-white"
                      : "text-gray-900 bg-white"
                  } font-bold relative px-7 py-2.5 transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0`}
                >
                  Note
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleOnclickRender("report")}
                className={`${
                  typeButton === "report"
                    ? " bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-cyan-200 hover:text-white"
                    : "bg-gradient-to-br from-cyan-500 to-blue-500"
                } relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium  rounded-lg group hover:text-white focus:outline-none`}
              >
                <span
                  className={`${
                    typeButton === "report"
                      ? "text-white"
                      : "text-gray-900 bg-white"
                  } font-bold relative px-7 py-2.5 transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0`}
                >
                  Report
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
