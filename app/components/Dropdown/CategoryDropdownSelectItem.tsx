import React, { useEffect, useRef, useState } from "react";
import "../../css/Button.css";
import { ConvertIconToJSX } from "../Icon/IconList";

export default function CategoryDropdownSelectItem({
  isShowCategoryListProps: isShowCategoryListProps,
  type_category: type_category,
  handleClick,
}: {
  isShowCategoryListProps: any;
  type_category: any;
  handleClick: any;
}) {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const transClass = isOpen ? "flex" : "hidden";
  const [categoryData, setCategoryData] = useState<any>([]);

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const toggle = () => {
    getCategoryData();
    setIsOpen((old) => !old);
  };

  const getCategoryData = () => {
    let categoryDataLocal = JSON.parse(localStorage.getItem("category") as any);
    if (categoryDataLocal) {
      setCategoryData(categoryDataLocal);
    } else {
      setCategoryData([
        { category_name: "There is't category.", category_id: 0 },
      ]);
    }
  };
  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    if (isShowCategoryListProps) {
      toggle();
    }
  }, []);

  return (
    <>
      <div className="relative">
        <div
          className={`absolute flex flex-col py-4  left-8 z-30 max-w-[280px] min-w-[10rem;] min-h-[100px] overflow-scroll max-h-[190px] bg-zinc-50 rounded-md ${transClass} dark:bg-slate-500 dark:text-white`}
        >
          {categoryData &&
            categoryData.map(
              (element: any) =>
                type_category === element.type_category && (
                  <div
                    className=" grid grid-cols-12 items-start mb-2"
                    key={element.category_id}
                  >
                    <div className="col-span-4 flex justify-center">
                      <div
                        style={{
                          fontSize: "35px",
                          color: "black",
                          minWidth: "22px",
                        }}
                      >
                        {ConvertIconToJSX(element.icon)}
                      </div>
                    </div>
                    <button
                      className="col-span-8 min-w-[10rem;] max-w-[20rem;] justify-center text-lg text-center  whitespace-nowrap overflow-x-auto hover:bg-zinc-300 hover:text-zinc-500 px-2 py-1 "
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(false, element);
                      }}
                    >
                      {element.category_name}
                    </button>
                  </div>
                )
            )}
        </div>
      </div>
      {isOpen ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/20"
          onClick={() => {
            handleClick(false, null);
            setIsOpen((old) => !old);
          }}
        ></div>
      ) : (
        <></>
      )}
    </>
  );
}
