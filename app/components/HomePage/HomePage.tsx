import React, { createContext, useEffect, useRef, useState } from "react";
import Loading from "../Effect/Loading";
import NoteComponent from "./NoteComponent";
import WalletComponent from "./WalletComponent";
import ReportComponent from "./ReportComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UserEmailDataContext = createContext<any>("");

export default function HomePage({
  mountComponentIndexProps: mountComponentIndexProps,
  userExpenseEmailProps: userExpenseEmailProps,
  isChangeTransferFormProps,
}: {
  mountComponentIndexProps: string;
  userExpenseEmailProps: string;
  isChangeTransferFormProps: any;
}) {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------

  const [showLoadingComponent, setShowLoading] = useState(true);

  //----------------------------------------------------------------
  //TODO:USE_EFFECT AREA
  //----------------------------------------------------------------
  useEffect(() => {
    if (mountComponentIndexProps !== null) {
      setShowLoading(false);
    }
  }, []);
  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------
  const renderControl = () => {
    switch (mountComponentIndexProps) {
      case "note":
        return <NoteComponent></NoteComponent>;
      case "wallet":
        return (
          <WalletComponent
            isChangeTransferForm={isChangeTransferFormProps}
          ></WalletComponent>
        );
      case "report":
        return <ReportComponent></ReportComponent>;
      default:
        return <>Default</>;
    }
  };

  return (
    <>
      <ToastContainer autoClose={1500} limit={4}></ToastContainer>
      <UserEmailDataContext.Provider value={userExpenseEmailProps}>
        {showLoadingComponent ? (
          <>
            <Loading></Loading>
          </>
        ) : (
          <> {renderControl()}</>
        )}
      </UserEmailDataContext.Provider>
    </>
  );
}
