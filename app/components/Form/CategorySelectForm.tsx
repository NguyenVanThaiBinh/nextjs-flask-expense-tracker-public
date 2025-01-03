import React, { useEffect, useRef, useState } from "react";

import convertToYMD from "../Function/workWithDate";
import BoldLine from "../Line/BoldLine";
import ThinLine from "../Line/ThinLine";

import { AiOutlineLeft } from "react-icons/ai";
import { BsPlus } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";

import CategoryCreateEditForm from "./CategoryCreateEditForm";
import fetchDataWithEndPoint from "../Function/workWithFetchData";
import { ConvertIconToJSX } from "../Icon/IconList";

export default function CategorySelectForm({
  isShowCategoryForm: isShowCategoryForm,
  handleClick,
  expenseOrEarningsProps,
}: {
  isShowCategoryForm: any;
  handleClick: any;
  expenseOrEarningsProps: string;
}) {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------

  const [categoryData, setCategoryData] = useState<any>([]);
  const [isShowCategoryCreateEditForm, setIsShowCategoryCreateEditForm] =
    useState(false);

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const checkCategoryData = async () => {
    try {
      let categoryData = JSON.parse(localStorage.getItem("category") as any);

      if (!categoryData && categoryData.length < 0) {
        const response = await fetchDataWithEndPoint(
          "/api/category/getCategoryByEmail",
          ""
        );

        if (response !== null) {
          categoryData = response.reverse();
          localStorage.setItem("category", JSON.stringify(response));
        } else {
          categoryData = [];
        }
      }
      setCategoryData(categoryData);
    } catch (error: any) {
      console.error(error);
    }
  };

  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    checkCategoryData();
  }, []);
  return (
    <>
      <form className=" relative px-4 mt-[-29em;] min-h-[33em;] border-y-zinc-500 z-30 w-full  flex-col  bg-zinc-200 dark:bg-gray-600  rounded-md flex  max-[376px]:min-h-[25em] max-[376px]:max-h-[29em] ">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4  ">
          <div className="text-left flex items-center">
            <a
              onClick={() => isShowCategoryForm(false)}
              className="relative justify-center p-2  text-2xl text-green-600 "
            >
              <AiOutlineLeft className="font-black" />
            </a>
          </div>
          <div className="flex text-center justify-center overflow-hidden">
            <p className="flex items-center text-xl font-medium text-gray-900 dark:text-white">
              Category
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsShowCategoryCreateEditForm(true);
              }}
              className="p-2  text-3xl text-green-600 "
            >
              <FaEdit />
            </button>
          </div>
        </div>
        <BoldLine></BoldLine>

        {/* TODO: INPUT FIELD */}
        <div className="max-h-[30em;] min-h-[30em;] overflow-scroll lg:overflow-auto  max-[376px]:min-h-[25em]  ">
          {expenseOrEarningsProps === "expense" ? (
            <>
              <div className=" relative ">
                {categoryData.map((categoryElement: any) => (
                  <React.Fragment key={categoryElement.category_id}>
                    {categoryElement.type_category === "expense" && (
                      <div>
                        <button
                          className="grid grid-cols-12 gap-4 p-4 w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            handleClick(categoryElement);
                          }}
                        >
                          <div className="col-span-10 flex">
                            <div
                              style={{
                                fontSize: "35px",
                                color: "#ff0505",
                                minWidth: "22px",
                              }}
                            >
                              {ConvertIconToJSX(categoryElement.icon)}
                            </div>

                            <span className="min-w-[10rem;] text-left flex ml-2  items-center text-lg whitespace-nowrap overflow-x-auto ">
                              {categoryElement.category_name}
                            </span>
                          </div>

                          <div className="col-span-2 text-right whitespace-nowrap overflow-x-auto text-cyan-600 "></div>
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className=" relative ">
                {categoryData.map((categoryElement: any) => (
                  <React.Fragment key={categoryElement.category_id}>
                    {categoryElement.type_category !== "expense" && (
                      <div key={categoryElement.category_id}>
                        <button
                          className="grid grid-cols-12 gap-4 p-4 w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            handleClick(categoryElement);
                          }}
                        >
                          <div className="col-span-10 flex">
                            <div
                              style={{
                                fontSize: "35px",
                                color: "#16a34a",
                                minWidth: "22px",
                              }}
                            >
                              {ConvertIconToJSX(categoryElement.icon)}
                            </div>

                            <span className="min-w-[10rem;] text-left flex ml-2  items-center text-lg whitespace-nowrap overflow-x-auto ">
                              {categoryElement.category_name}
                            </span>
                          </div>

                          <div className="col-span-2 text-right whitespace-nowrap overflow-x-auto text-cyan-600 "></div>
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
          {isShowCategoryCreateEditForm ? (
            <div
              className="fixed top-0 right-0 bottom-0 left-0 z-30 bg-black/20"
              onClick={() => {
                setIsShowCategoryCreateEditForm(false);
                checkCategoryData();
              }}
            ></div>
          ) : (
            <></>
          )}
        </div>
      </form>
      {isShowCategoryCreateEditForm && (
        <CategoryCreateEditForm
          isShowCategoryForm={() => {
            setIsShowCategoryCreateEditForm(false);
            checkCategoryData();
          }}
        ></CategoryCreateEditForm>
      )}
    </>
  );
}
