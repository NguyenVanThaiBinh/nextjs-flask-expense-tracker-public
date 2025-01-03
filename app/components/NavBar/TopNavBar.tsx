import React, { useState } from "react";
import InfoDropdown from "../Dropdown/InfoDropdown";
import WalletDropdownCheckBox from "../Dropdown/WalletDropdownCheckBox";
import { GiWallet } from "react-icons/gi";
import WalletTransformForm from "../Form/WalletTransformForm";

export default function TopNavBar({
  UserInfo,
  isChangeTransferForm: isChangeTransfer,
}: {
  UserInfo: any;
  isChangeTransferForm: any;
}) {
  //----------------------------------------------------------------
  //TODO:DECLARE AREA
  //----------------------------------------------------------------
  const userInfo = UserInfo;
  const [isOpen, setIsOpen] = useState<boolean>(false);


  //----------------------------------------------------------------
  //TODO:FUNCTION AREA
  //----------------------------------------------------------------

  const toggle = () => {
    setIsOpen((old) => !old);
  };

  const handleIsChangeTransferForm = (isChangeTransferForm: any) => {
    if (isChangeTransferForm) {
      isChangeTransfer(isChangeTransferForm);
    }
  };
  return (
    <>
      <div className="grid grid-cols-12">
        <div className="flex col-span-7    text-left justify-start items-start  max-w-screen-xl ">
          <InfoDropdown UserInfo={userInfo}></InfoDropdown>
        </div>
        <div className="col-span-5 flex items-center  justify-between">
          <button
            className="flex text-white font-semibold text-base text-center p-6 py-4 "
            onClick={toggle}
          >
            Transfer
            <GiWallet
              style={{
                fontSize: "23px",
                marginLeft: "5px",
              }}
            ></GiWallet>
          </button>
        </div>
      </div>
      <WalletTransformForm
        isShowWalletTransformForm={isOpen}
        isChangeTransferForm={handleIsChangeTransferForm}
      ></WalletTransformForm>

      {isOpen ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/20"
          onClick={toggle}
        ></div>
      ) : (
        <></>
      )}
    </>
  );
}
