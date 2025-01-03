import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import DataLabelsPlugin from "chartjs-plugin-datalabels";
import { FormExpenseDataType } from "../ObjectType/ExpenseType";
import { ConvertIconToJSX } from "../Icon/IconList";
import currencyFormatter from "../Function/workWithCurrency";
import {
  handleApiErrorPromiseAndRemoveLocalstorage,
  showToastErrorContent,
} from "../Function/workWithApiError";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchDataWithEndPoint from "../Function/workWithFetchData";
import Loading from "../Effect/Loading";
import React from "react";
export default function App() {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------
  Chart.register(CategoryScale);
  Chart.register(DataLabelsPlugin);
  const currentYear = new Date().getFullYear();
  const [expenseDataList, setExpenseDataList] = useState<FormExpenseDataType[]>(
    []
  );
  const [expenseType, setExpenseType] = useState("expense");
  const [showLoadingComponent, setShowLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedChartType, setSelectedChartType] = useState("Pie");
  const [chartConfig, setChartConfig] = useState({
    labels:
      expenseDataList && expenseDataList.map((data) => data.category_name),
    datasets: [
      {
        data:
          expenseDataList && expenseDataList.map((data) => data.expense_amount),
        backgroundColor: generateColorPalette(50),
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const [chartDataRender, setChartDataRender] = useState<FormExpenseDataType[]>(
    []
  );

  const yearOptions = [];
  for (let year = currentYear - 5; year <= currentYear; year++) {
    yearOptions.push(
      <option key={year} value={year}>
        {year}
      </option>
    );
  }

  const monthOptions = [];
  for (let month = 1; month <= 12; month++) {
    monthOptions.push(
      <option key={month} value={month}>
        {month}
      </option>
    );
  }
  const expenseOptions = [
    <option key={1} value={"expense"}>
      Expense
    </option>,
    <option key={2} value={"earnings"}>
      Earning
    </option>,
  ];
  const chartOptions = [
    <option key={1} value={"Pie"}>
      Pie
    </option>,
    <option key={2} value={"Bar"}>
      Bard
    </option>,
  ];

  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  function generateColorPalette(numColors: number) {
    const colorPalette = [];

    for (let i = 0; i < numColors; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const color = `rgb(${r}, ${g}, ${b})`;
      colorPalette.push(color);
    }
    return colorPalette;
  }
  function groupExpensesByCategory(expenses: any) {
    const groupedExpenses: any = {};

    for (const expense of expenses) {
      const categoryName = expense.category_name;

      if (!groupedExpenses[categoryName]) {
        groupedExpenses[categoryName] = {
          category_name: categoryName,
          expense_amount: 0,
          icon: expense.icon,
          type_category: expense.type_category,
          expense_id: expense.expense_id,
        };
      }

      groupedExpenses[categoryName].expense_amount += parseInt(
        expense.expense_amount
      );
    }

    return Object.values(groupedExpenses);
  }

  const filterAndSortExpenseDate = (
    expenseData: FormExpenseDataType[],
    type_category: string
  ) => {
    //Filter
    if (type_category === "expense") {
      expenseData = expenseData.filter(
        (item) => item.type_category === "expense"
      );
    } else {
      expenseData = expenseData.filter(
        (item) => item.type_category === "earnings"
      );
    }
    //Sort
    expenseData = expenseData.sort((a: any, b: any) =>
      a.category_name.localeCompare(b.category_name)
    );
    return expenseData;
  };
  const getExpenseData = async (year: any, month: any) => {
    try {
      setShowLoading(true);
      const response = await fetchDataWithEndPoint(
        "/api/expense/getExpenseByEmail",
        { Month: month, Year: year }
      );

      if (response !== null) {
        localStorage.setItem(
          "expense_" + year + month,
          JSON.stringify(response)
        );
      } else {
        localStorage.setItem("expense_" + year + month, JSON.stringify([]));
      }

      setShowLoading(false);
    } catch (error: any) {
      return handleApiErrorPromiseAndRemoveLocalstorage(error);
    }
  };
  const getOneYearExpenseData = async (year: any) => {
    try {
      const response = await fetchDataWithEndPoint(
        "/api/expense/getDataExpenseOneYear",
        { Year: year }
      );

      if (response !== null) {
        localStorage.setItem("expense_" + year, JSON.stringify(response));

        return response;
      }

      return null;
    } catch (error: any) {
      return handleApiErrorPromiseAndRemoveLocalstorage(error);
    }
  };

  const handleYearChange = async (event: any) => {
    setSelectedYear(parseInt(event.target.value));
    if (event.target.value === "Bar") {
      let charData = JSON.parse(
        localStorage.getItem("expense_" + event.target.value) || "[]"
      );
      if (charData.length === 0) {
        charData = (await getOneYearExpenseData(event.target.value)) || [];
      }
      setChartConfig({
        labels: charData.map((data: any) => data.month),
        datasets: [
          {
            data: charData.map((data: any) => data.expense),
            backgroundColor: generateColorPalette(50),
            borderColor: "black",
            borderWidth: 2,
          },
        ],
      });
      if (charData.length === 0) {
        showToastErrorContent("Nothing data to show!", "ReportComponent");
        let array: any[] = [];
        setChartConfig({
          labels: array.map((data: any) => data.month),
          datasets: [
            {
              data: array.map((data: any) => data.expense),
              backgroundColor: generateColorPalette(50),
              borderColor: "black",
              borderWidth: 2,
            },
          ],
        });
      }
      return;
    }

    let expenseDataByMonth = JSON.parse(
      localStorage.getItem("expense_" + event.target.value + selectedMonth) ||
        "[]"
    );
    if (expenseDataByMonth.length <= 0) {
      await getExpenseData(event.target.value, selectedMonth);
      expenseDataByMonth = JSON.parse(
        localStorage.getItem("expense_" + event.target.value + selectedMonth) ||
          "[]"
      );
    }

    if (expenseDataByMonth.length > 0) {
      setExpenseDataList(
        filterAndSortExpenseDate(expenseDataByMonth, expenseType)
      );
      let groupedExpense: any = groupExpensesByCategory(
        filterAndSortExpenseDate(expenseDataByMonth, expenseType)
      );
      setChartDataRender(groupedExpense);
    } else {
      setExpenseDataList([]);
      setChartDataRender([]);
      showToastErrorContent("Nothing data to show!", "ReportComponent");
    }
  };

  const handleMonthChange = async (event: any) => {
    setSelectedMonth(parseInt(event.target.value));
    let expenseDataByMonth = JSON.parse(
      localStorage.getItem("expense_" + selectedYear + event.target.value) ||
        "[]"
    );
    if (expenseDataByMonth.length <= 0) {
      await getExpenseData(selectedYear, event.target.value);
      expenseDataByMonth = JSON.parse(
        localStorage.getItem("expense_" + selectedYear + event.target.value) ||
          "[]"
      );
    }
    if (expenseDataByMonth.length > 0) {
      setExpenseDataList(
        filterAndSortExpenseDate(expenseDataByMonth, expenseType)
      );
      let groupedExpense: any = groupExpensesByCategory(
        filterAndSortExpenseDate(expenseDataByMonth, expenseType)
      );
      setChartDataRender(groupedExpense);
    } else {
      setExpenseDataList([]);
      setChartDataRender([]);
      showToastErrorContent("Nothing data to show!", "ReportComponent");
    }
  };

  const handleExpenseChange = async (event: any) => {
    setExpenseType(event.target.value);
    if (selectedChartType === "Bar") {
      let chartData = JSON.parse(
        localStorage.getItem("expense_" + selectedYear) || "[]"
      );

      if (event.target.value === "expense") {
        setChartConfig({
          labels: chartData.map((data: any) => data.month),
          datasets: [
            {
              data: chartData.map((data: any) => data.expense),
              backgroundColor: generateColorPalette(50),
              borderColor: "black",
              borderWidth: 2,
            },
          ],
        });
      } else {
        setChartConfig({
          labels: chartData.map((data: any) => data.month),
          datasets: [
            {
              data: chartData.map((data: any) => data.earnings),
              backgroundColor: generateColorPalette(50),
              borderColor: "black",
              borderWidth: 2,
            },
          ],
        });
      }
      return;
    }
    let expenseDataByMonth = JSON.parse(
      localStorage.getItem("expense_" + selectedYear + selectedMonth) || "[]"
    );
    if (expenseDataByMonth.length > 0) {
      setExpenseDataList(
        filterAndSortExpenseDate(expenseDataByMonth, event.target.value)
      );
      let groupedExpense: any = groupExpensesByCategory(
        filterAndSortExpenseDate(expenseDataByMonth, event.target.value)
      );
      setChartDataRender(groupedExpense);
    } else {
      setExpenseDataList([]);
      showToastErrorContent("Nothing data to show!", "ReportComponent");
    }
  };

  const handleChartTypeChange = async (event: any) => {
    setSelectedChartType(event.target.value);
    if (event.target.value === "Bar") {
      let charData = JSON.parse(
        localStorage.getItem("expense_" + selectedYear) || "[]"
      );
      if (charData.length === 0) {
        charData = await getOneYearExpenseData(selectedYear);
      }
      setChartConfig({
        labels: charData.map((data: any) => data.month),
        datasets: [
          {
            data: charData.map((data: any) => data.expense),
            backgroundColor: generateColorPalette(50),
            borderColor: "black",
            borderWidth: 2,
          },
        ],
      });
      handleBarChartClick(selectedMonth);
    } else {
      let expenseDataByMonth = JSON.parse(
        localStorage.getItem("expense_" + selectedYear + selectedMonth) || "[]"
      );
      let groupedExpense: any = groupExpensesByCategory(
        filterAndSortExpenseDate(expenseDataByMonth, expenseType)
      );
      setChartDataRender(groupedExpense);
      setExpenseDataList(
        filterAndSortExpenseDate(expenseDataByMonth, expenseType)
      );
    }
  };

  const handleScrollToLabel = (label: string) => {
    const elements = document.getElementsByClassName(label);
    if (elements.length > 0) {
      elements[0].scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleBarChartClick = async (labelMonth: any) => {
    if (labelMonth === undefined || labelMonth === "") {
      return;
    }
    let expenseDataByMonth = JSON.parse(
      localStorage.getItem("expense_" + selectedYear + labelMonth) || "[]"
    );

    if (expenseDataByMonth.length <= 0) {
      await getExpenseData(selectedYear, labelMonth);
      expenseDataByMonth = JSON.parse(
        localStorage.getItem("expense_" + selectedYear + labelMonth) || "[]"
      );
    }

    let groupedExpense: any = groupExpensesByCategory(
      filterAndSortExpenseDate(expenseDataByMonth, expenseType)
    );

    setExpenseDataList(groupedExpense);
  };
  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    let expenseDataByMonth = JSON.parse(
      localStorage.getItem("expense_" + selectedYear + selectedMonth) || "[]"
    );
    if (expenseDataByMonth.length > 0) {
      setExpenseDataList(
        filterAndSortExpenseDate(expenseDataByMonth, "expense")
      );
      let groupedExpense: any = groupExpensesByCategory(
        filterAndSortExpenseDate(expenseDataByMonth, "expense")
      );
      setChartDataRender(groupedExpense);
    } else {
      showToastErrorContent("Nothing data to show!", "ReportComponent");
    }
    getOneYearExpenseData(selectedYear);
  }, []);
  return (
    <>
      <ToastContainer
        autoClose={1500}
        limit={4}
        containerId="ReportComponent"
      ></ToastContainer>
      <ToastContainer autoClose={1500} limit={4}></ToastContainer>
      <div className="h-[350px] flex text-center items-center justify-center max-[376px]:h-[290px] ">
        {showLoadingComponent ? (
          <>
            <Loading></Loading>
          </>
        ) : (
          <>
            {selectedChartType === "Pie" ? (
              <Pie
                data={{
                  labels:
                    chartDataRender &&
                    chartDataRender.map((data) => data.category_name),
                  datasets: [
                    {
                      data:
                        chartDataRender &&
                        chartDataRender.map((data) => data.expense_amount),
                      backgroundColor: generateColorPalette(50),
                      borderColor: "black",
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    datalabels: {
                      formatter: (value: any, ctx: any) => {
                        const dataPoints = ctx.chart.data.datasets[0].data;
                        const total = dataPoints.reduce(
                          (total: any, dataPoint: any) => total + dataPoint,
                          0
                        );
                        const percentage = (value / total) * 100;
                        if (percentage > 4) {
                          return percentage.toFixed(2) + "%";
                        } else {
                          return null;
                        }
                      },
                      color: "white",
                    },
                    legend: {
                      labels: {
                        color: "white",
                      },
                    },
                  },
                  onClick: (e: any, activeEls) => {
                    // let datasetIndex =activeEls[0] && activeEls[0].datasetIndex || -1;
                    let dataIndex = (activeEls[0] && activeEls[0].index) || -1;
                    // let value =
                    // datasetIndex && e.chart.data.datasets[datasetIndex].data[dataIndex];
                    let label = e.chart.data.labels[dataIndex];

                    handleScrollToLabel(label);
                  },
                }}
              />
            ) : (
              <Bar
                data={chartConfig}
                options={{
                  plugins: {
                    datalabels: {
                      color: "white",
                    },
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: "white" },
                    },
                    y: {
                      ticks: { color: "white" },
                    },
                  },

                  onClick: (e: any, activeEls) => {
                    let dataIndex = (activeEls[0] && activeEls[0].index) || -1;
                    let label = e.chart.data.labels[dataIndex];

                    handleBarChartClick(label);
                  },
                }}
              />
            )}
          </>
        )}
      </div>
      <div className=" flex text-center items-center justify-center ">
        <select
          value={expenseType}
          onChange={handleExpenseChange}
          className="border  px-4 py-1 h-8 text-sm bg-gray-50  border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-30 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {expenseOptions}
        </select>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="border  px-4 py-1 h-8 text-sm bg-gray-50  border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {yearOptions}
        </select>
        <select
          disabled={selectedChartType === "Bar" ? true : false}
          value={selectedMonth}
          onChange={handleMonthChange}
          className="border  px-4 py-1 h-8 text-sm bg-gray-50  border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {monthOptions}
        </select>
        <select
          value={selectedChartType}
          onChange={handleChartTypeChange}
          className="border  px-4 py-1 h-8 text-sm bg-gray-50  border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {chartOptions}
        </select>
      </div>
      <div
        className={`${
          expenseDataList && expenseDataList.length > 0 ? "" : "hidden "
        }pt-1 justify-center bg-white overflow-scroll lg:overflow-auto max-h-[11em;]`}
      >
        {expenseDataList &&
          expenseDataList.map((expenseElement: FormExpenseDataType) => (
            <div
              key={expenseElement.expense_id}
              className={expenseElement.category_name}
            >
              {!expenseElement.del_flag && (
                <>
                  <div className="grid grid-cols-12 mb-2">
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

                      <span className=" ml-1 text-base font-medium text-cyan-600 whitespace-nowrap overflow-x-auto">
                        {expenseElement.category_name}
                        <span className="text-[0.7rem]">
                          {expenseElement.expense_description &&
                            expenseElement.expense_description.length < 20 &&
                            "(" + expenseElement.expense_description + ")"}
                          {expenseElement.expense_description &&
                            expenseElement.expense_description.length >= 20 &&
                            "(" +
                              expenseElement.expense_description.slice(0, 10) +
                              "...)"}
                        </span>
                      </span>
                    </div>

                    <div className="col-span-5 text-right pr-2 whitespace-nowrap overflow-x-auto  ">
                      {expenseElement.type_category === "expense" ? (
                        <div className="items-center justify-center font-bold text-red-700">
                          {"- " +
                            currencyFormatter(expenseElement.expense_amount)}
                        </div>
                      ) : (
                        <div className="items-center justify-center font-bold text-green-700 ">
                          {"+ " +
                            currencyFormatter(expenseElement.expense_amount)}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </>
  );
}
