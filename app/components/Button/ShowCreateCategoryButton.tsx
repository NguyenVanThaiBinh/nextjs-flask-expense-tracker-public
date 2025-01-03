import React from "react";
import "../../css/Button.css";
export default function ShowCreateCategoryButton(props: any) {
  const handleShowCreateCategoryButtonOnclick = () => {
    props.ShowCreateCategoryButton(true);
  };
  return (
    <>
      <button
        disabled={true}
        className="w-auto h-auto  cus-animate-ping absolute opacity-20 "
      >
        <div className="w-auto h-auto inline-flex ">
          <div className="flex-1 h-full">
            <div className="flex items-center justify-center flex-1 h-full p-2 bg-green-500 text-white shadow rounded-full">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-9 w-9"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          handleShowCreateCategoryButtonOnclick();
        }}
      >
        <div className="w-auto h-auto inline-flex ">
          <div className="flex-1 h-full">
            <div className="flex items-center justify-center flex-1 h-full p-2 bg-green-500 text-white shadow rounded-full">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-9 w-9"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </button>
    </>
  );
}
