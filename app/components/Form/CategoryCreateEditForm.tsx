import React, { useEffect, useRef, useState } from "react";
import BoldLine from "../Line/BoldLine";
import ThinLine from "../Line/ThinLine";
import ShowCreateCategoryButton from "../Button/ShowCreateCategoryButton";

import "react-toastify/dist/ReactToastify.css";

import * as Icon from "../Icon/IconList";
import { GoChevronDown } from "react-icons/go";
import { ConvertIconToJSX } from "../Icon/IconList";
import { AiOutlineLeft } from "react-icons/ai";
import { RxUpdate } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { TbHexagonPlus } from "react-icons/tb";

import CategoryDropdownSelectItem from "../Dropdown/CategoryDropdownSelectItem";
import {
  handleApiErrorPromiseAndRemoveLocalstorage,
  showToastErrorContent,
} from "../Function/workWithApiError";
import isDeleteConfirmAlert from "../Function/workWithAlert";
import { toast } from "react-toastify";

import axios from "axios";
import isDeepEqualObject from "../Function/workWithObject";

export default function CategoryCreateEditForm({
  isShowCategoryForm: isShowCategoryForm,
}: {
  isShowCategoryForm: any;
}) {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------
  const [expenseOrEarnings, setExpenseOrEarnings] = useState("expense");
  const [isCreateFrom, setIsCreateFrom] = useState(false);
  const [isShowIconList, setIsShowIconList] = useState(true);
  const [isShowDropboxCategory, setIsShowDropboxCategory] = useState(false);
  const [categoryDataLocalStorage, setCategoryDataLocalStorage] = useState<any>(
    JSON.parse(localStorage.getItem("category") as any)
  );
  const checkCategoryData = useRef<any>(null);
  const [categoryItemData, setCategoryItemData] = useState<any>({
    category_id: null,
    icon: "",
    category_name: "",
    type_category: "",
    del_flag: false,
  });

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const handleChangeCategory = (type: string) => {
    if (type === "expense") {
      setExpenseOrEarnings("expense");
      setDefaultData("expense");
    } else {
      setExpenseOrEarnings("earnings");
      setDefaultData("earnings");
    }
  };

  const handleCreateNewCategory = (type: boolean) => {
    if (type === true) {
      setIsCreateFrom(true);
      setCategoryItemData({
        ["category_name"]: "",
        ["icon"]: "",
        ["type_category"]: expenseOrEarnings,
        ["category_id"]: null,
        ["del_flag"]: false,
      });
    }
  };

  const handleCategoryListFromChild = (
    isShowDropboxCategory: boolean,
    categoryData: any
  ) => {
    setIsShowDropboxCategory(isShowDropboxCategory);
    if (!categoryData) return;
    if (categoryData.icon) {
      setCategoryItemData({
        ...categoryItemData,
        ["category_name"]: categoryData.category_name,
        ["icon"]: categoryData.icon,
        ["category_id"]: categoryData.category_id,
        ["type_category"]: categoryData.type_category,
      });
      checkCategoryData.current = categoryData;
    } else {
      setCategoryItemData({
        ...categoryItemData,
        ["icon"]: categoryData,
      });
    }
  };

  const setDefaultData = (type_category: string) => {
    if (!categoryDataLocalStorage || isCreateFrom) {
      setCategoryItemData({
        ...categoryItemData,
        ["type_category"]: type_category,
      });
      return;
    }

    let filteredData = categoryDataLocalStorage.filter(
      (e: any) => e.type_category === type_category
    );

    if (filteredData.length > 0) {
      setCategoryItemData({
        ["category_name"]: filteredData[0].category_name,
        ["icon"]: filteredData[0].icon,
        ["type_category"]: filteredData[0].type_category,
        ["category_id"]: filteredData[0].category_id,
        ["del_flag"]: false,
        ["user_email"]: filteredData[0].user_email,
      });
      checkCategoryData.current = filteredData[0];
    }
  };

  const handleCategoryUpdate = async (isEditMode: boolean, type: string) => {
    if (type !== "delete") {
      // Validate required fields before API call
      if (!categoryItemData.category_name.trim()) {
        showToastErrorContent("Category Name is Null!");
        return;
      }
      if (!categoryItemData.icon.trim()) {
        showToastErrorContent("Please select Icon!");
        return;
      }

      // Check for update only if category data has changed
      if (
        checkCategoryData.current &&
        isDeepEqualObject(categoryItemData, checkCategoryData.current)
      ) {
        showToastErrorContent("Nothing to update !");
        return;
      }
    }

    // Handle delete confirmation for edit mode with "delete" type
    if (isEditMode && type === "delete") {
      if (!categoryItemData.category_id) {
        showToastErrorContent("Nothing to delete !");
        return;
      }

      const isConfirmed = await isDeleteConfirmAlert();
      if (!isConfirmed) {
        return;
      }
      categoryItemData.del_flag = true;
    }

    isEditMode = isCreateFrom ? false : isEditMode; // Set edit mode based on isCreateFrom

    try {
      const toastPromise = toast.promise(
        axios.post("/api/category/insertUpdateCategory", categoryItemData, {
          headers: {
            Authorization: localStorage.getItem("jwt_token"),
          },
        }),
        {
          pending: {
            render() {
              return getPendingMessage(isEditMode, type);
            },
          },
          success: {
            render({ data }) {
              const newCategory = data.data.new_category;
              updateLocalCategory(newCategory, isEditMode, type);
              return getSuccessMessage(isEditMode, type);
            },
          },
          error: {
            render({ data }) {
              return handleApiErrorPromiseAndRemoveLocalstorage(data);
            },
          },
        }
      );

      await toastPromise; // Wait for toast promise to resolve

      checkCategoryData.current = categoryItemData;
    } catch (error) {}
  };

  function getPendingMessage(isEditMode: boolean, type: string) {
    return isEditMode && type === "delete"
      ? "Deleting Category..."
      : isEditMode
      ? "Editing Category..."
      : "Creating new Category...";
  }

  function getSuccessMessage(isEditMode: boolean, type: string) {
    return isEditMode && type === "delete"
      ? "Delete Category successfully!"
      : isEditMode
      ? "Edit Category successfully"
      : "Add Category successfully!";
  }

  function updateLocalCategory(
    newCategory: any,
    isEditMode: boolean,
    type: string
  ) {
    let existingCategory = JSON.parse(localStorage.getItem("category") || "[]");
    if (existingCategory.length > 0 && isEditMode) {
      const indexOfElementBeforeEdit = existingCategory.findIndex(
        (category: any) => category.category_id === newCategory.category_id
      );
      existingCategory = existingCategory.filter(
        (category: any) => category.category_id !== newCategory.category_id
      );
      if (newCategory.del_flag === false) {
        existingCategory.splice(indexOfElementBeforeEdit, 0, newCategory);
      }
    }

    if (isEditMode === false) {
      existingCategory.push(newCategory);
    }
    localStorage.setItem("category", JSON.stringify(existingCategory));
    if (type === "delete" || isEditMode === false) {
      setCategoryItemData({
        category_id: null,
        icon: "",
        category_name: "",
        type_category: "",
        del_flag: false,
      });
      checkCategoryData.current = {
        category_id: null,
        icon: "",
        category_name: "",
        type_category: "",
        del_flag: false,
      };
    }
  }

  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    let categoryData = JSON.parse(localStorage.getItem("category") as any);

    if (categoryData) {
      setCategoryDataLocalStorage(categoryData);
      setDefaultData("expense");
    }
  }, []);
  return (
    <>
      <form
        className=" relative  mt-[-33em;] min-h-[34em;] border-y-zinc-500 z-30 w-full  flex-col  bg-zinc-200 dark:bg-gray-600  rounded-md max-[376px]:mt-[-30em;]  
      max-[376px]:min-h-[30em;]   "
      >
        <div className="grid grid-cols-12  gap-1  ">
          <div className="col-span-2 text-left flex items-center">
            <a
              onClick={() => isShowCategoryForm(false)}
              className="relative justify-center p-2  text-2xl text-green-600 "
            >
              <AiOutlineLeft className="font-black" />
            </a>
          </div>
          <div
            className={` ${
              isCreateFrom ? "col-span-7" : "col-span-6"
            } flex text-center justify-center overflow-hidden`}
          >
            <p className="flex items-center justify-center text-xl font-medium text-gray-900 dark:text-white">
              {isCreateFrom ? "Create Category" : "Update Category"}
            </p>
          </div>
          {
            <div
              className={`${
                isCreateFrom ? "" : "col-span-2"
              } flex justify-center`}
            >
              {!isCreateFrom && (
                <a
                  onClick={() => handleCategoryUpdate(true, "delete")}
                  className="p-2  text-3xl text-red-600 "
                >
                  <MdDelete />
                </a>
              )}
            </div>
          }
          <div className="col-span-2 flex justify-end">
            <a
              onClick={() => handleCategoryUpdate(true, "update")}
              className="p-2  text-3xl text-green-600 "
            >
              {isCreateFrom ? <TbHexagonPlus /> : <RxUpdate />}
            </a>
          </div>
        </div>
        <BoldLine></BoldLine>
        {/* Expense or Earning category */}
        <div
          className="flex mt-2  rounded-md shadow-sm justify-center "
          role="group"
        >
          <button
            type="button"
            onClick={() => handleChangeCategory("expense")}
            className={` ${
              expenseOrEarnings === "expense"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-900"
            } px-14 py-2 text-sm font-medium   border border-gray-200 rounded-s-md focus:bg-red-600 hover:text-white focus:z-10 focus:ring-2  focus:ring-white focus:text-white `}
          >
            Expense
          </button>

          <button
            type="button"
            onClick={() => handleChangeCategory("earnings")}
            className={` ${
              expenseOrEarnings === "earnings"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-900"
            } px-14 py-2 text-sm font-medium   border border-gray-200 rounded-e-md focus:bg-green-600 hover:text-white focus:z-10 focus:ring-2  focus:ring-white focus:text-white  `}
          >
            Earnings
          </button>
        </div>
        {/* TODO: INPUT FIELD */}
        <div className="max-h-[30em;] ">
          {expenseOrEarnings === "expense" ? (
            <>
              <div className=" relative grid grid-cols-12 ">
                <div className="col-span-10 gap-4 p-2 w-full ">
                  <div className=" flex p-1 text-red-600 border-solid border-2 border-indigo-600 ">
                    <div className="flex justify-center text-center items-center text-3xl">
                      {ConvertIconToJSX(categoryItemData.icon)}
                    </div>

                    <input
                      type="text"
                      maxLength={30}
                      onChange={(e) => {
                        setCategoryItemData({
                          ...categoryItemData,
                          ["category_name"]: e.target.value,
                        });
                      }}
                      value={categoryItemData.category_name}
                      className="h-10 flex ml-3 text-center  items-center text-xl bg-gray-50 border  border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                    />
                  </div>
                </div>
                <div className="col-span-2 flex p-2 text-center justify-center whitespace-nowrap overflow-x-auto text-cyan-600 ">
                  {!isCreateFrom && (
                    <button
                      type="button"
                      onClick={() => setIsShowDropboxCategory(true)}
                    >
                      <GoChevronDown
                        style={{ fontSize: "30px" }}
                      ></GoChevronDown>
                    </button>
                  )}
                </div>
              </div>
              <ThinLine></ThinLine>
              <div className="width-100 mt-2">
                {isShowDropboxCategory && (
                  <CategoryDropdownSelectItem
                    isShowCategoryListProps={isShowDropboxCategory}
                    type_category={expenseOrEarnings}
                    handleClick={handleCategoryListFromChild}
                  ></CategoryDropdownSelectItem>
                )}
              </div>
            </>
          ) : (
            <>
              <div className=" relative grid grid-cols-12 ">
                <div className="col-span-10 gap-4 p-2 w-full ">
                  <div className=" flex p-1 text-green-600 border-solid border-2 border-indigo-600 ">
                    <div className="flex justify-center text-center items-center text-3xl">
                      {ConvertIconToJSX(categoryItemData.icon)}
                    </div>

                    <input
                      type="text"
                      maxLength={30}
                      onChange={(e) => {
                        setCategoryItemData({
                          ...categoryItemData,
                          ["category_name"]: e.target.value,
                        });
                      }}
                      value={categoryItemData.category_name}
                      className="h-10 flex ml-3 text-center  items-center text-xl bg-gray-50 border  border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                    />
                  </div>
                </div>
                <div className="col-span-2 flex p-2 text-center justify-center whitespace-nowrap overflow-x-auto text-cyan-600 ">
                  {!isCreateFrom && (
                    <button
                      type="button"
                      onClick={() => setIsShowDropboxCategory(true)}
                    >
                      <GoChevronDown
                        style={{ fontSize: "30px" }}
                      ></GoChevronDown>
                    </button>
                  )}
                </div>
              </div>
              <ThinLine></ThinLine>
              <div className="width-100 mt-2">
                {isShowDropboxCategory && (
                  <CategoryDropdownSelectItem
                    isShowCategoryListProps={isShowDropboxCategory}
                    type_category={expenseOrEarnings}
                    handleClick={handleCategoryListFromChild}
                  ></CategoryDropdownSelectItem>
                )}
              </div>
            </>
          )}
          {isShowIconList && (
            <Icon.default
              handleClick={handleCategoryListFromChild}
            ></Icon.default>
          )}
        </div>{" "}
        {!isCreateFrom && (
          <div className="text-center">
            <ShowCreateCategoryButton
              ShowCreateCategoryButton={handleCreateNewCategory}
            ></ShowCreateCategoryButton>
          </div>
        )}
      </form>
    </>
  );
}
