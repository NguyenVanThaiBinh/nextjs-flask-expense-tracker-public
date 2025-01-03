import React from "react";
import { GiHeartEarrings } from "react-icons/gi";
import { GiMeal } from "react-icons/gi";
import { IoRestaurant } from "react-icons/io5";
import { GiBeerStein } from "react-icons/gi";
import { IoIosCafe } from "react-icons/io";
import { FaTrainTram } from "react-icons/fa6";
import { AiFillMedicineBox } from "react-icons/ai";
import { FaGasPump } from "react-icons/fa6";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { GiClothes } from "react-icons/gi";
import { SiElectron } from "react-icons/si";
import { GiPayMoney } from "react-icons/gi";
import { BsHouseDoorFill } from "react-icons/bs";
import { GiCampingTent } from "react-icons/gi";
import { FaBaby } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoFootball } from "react-icons/io5";
import { ImBook } from "react-icons/im";
import { TfiCut } from "react-icons/tfi";
import { GiMicrophone } from "react-icons/gi";
import { MdHealthAndSafety } from "react-icons/md";
import { BiRun } from "react-icons/bi";
import { GiLoveLetter } from "react-icons/gi";
import { FaDog } from "react-icons/fa6";
import { IoDiceSharp } from "react-icons/io5";
import { GiLipstick } from "react-icons/gi";
import { ImCoinDollar } from "react-icons/im";
import { FaHandHoldingWater } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineElectricBolt } from "react-icons/md";
import { FaPeopleCarryBox } from "react-icons/fa6";
import { GiDeadHead } from "react-icons/gi";
import { GiTakeMyMoney } from "react-icons/gi";
import { GiSellCard } from "react-icons/gi";
import { FaHandHoldingUsd } from "react-icons/fa";
import { MdInsertEmoticon } from "react-icons/md";

export default function IconList({ handleClick }: { handleClick: any }) {
  return (
    <>
      <div
        className=" min-h-[14em] max-h-[21em] overflow-y-auto 
      max-[376px]:max-h-[17.5em] "
      >
        <div className="grid grid-cols-12 gap-3 mb-4 text-4xl">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "GiHeartEarringsIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <GiHeartEarrings></GiHeartEarrings>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "GiMealIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <GiMeal></GiMeal>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "IoRestaurantIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <IoRestaurant></IoRestaurant>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "GiBeerSteinIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <GiBeerStein></GiBeerStein>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "IoIosCafeIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <IoIosCafe></IoIosCafe>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "FaTrainTramIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <FaTrainTram></FaTrainTram>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "AiFillMedicineBoxIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <AiFillMedicineBox></AiFillMedicineBox>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "FaGasPumpIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <FaGasPump></FaGasPump>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "FaScrewdriverWrenchIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <FaScrewdriverWrench></FaScrewdriverWrench>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "GiClothesIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <GiClothes></GiClothes>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "SiElectronIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <SiElectron></SiElectron>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "GiPayMoneyIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <GiPayMoney></GiPayMoney>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "BsHouseDoorFillIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <BsHouseDoorFill></BsHouseDoorFill>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "GiCampingTentIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <GiCampingTent></GiCampingTent>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "FaBabyIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <FaBaby></FaBaby>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "BsFillTelephoneFillIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <BsFillTelephoneFill></BsFillTelephoneFill>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "IoFootballIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <IoFootball></IoFootball>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "ImBookIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <ImBook></ImBook>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "TfiCutIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <TfiCut></TfiCut>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "GiMicrophoneIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <GiMicrophone></GiMicrophone>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "MdHealthAndSafetyIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <MdHealthAndSafety></MdHealthAndSafety>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "BiRunIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <BiRun></BiRun>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "GiLoveLetterIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <GiLoveLetter></GiLoveLetter>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "FaDogIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <FaDog></FaDog>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "IoDiceSharpIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <IoDiceSharp></IoDiceSharp>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "GiLipstickIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <GiLipstick></GiLipstick>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "ImCoinDollarIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <ImCoinDollar></ImCoinDollar>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "FaHandHoldingWaterIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <FaHandHoldingWater></FaHandHoldingWater>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "FaShoppingCartIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <FaShoppingCart></FaShoppingCart>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "MdOutlineElectricBoltIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <MdOutlineElectricBolt></MdOutlineElectricBolt>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "FaPeopleCarryBoxIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <FaPeopleCarryBox></FaPeopleCarryBox>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "GiDeadHeadIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <GiDeadHead></GiDeadHead>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "GiTakeMyMoneyIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <GiTakeMyMoney></GiTakeMyMoney>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "GiSellCardIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <GiSellCard></GiSellCard>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick(false, "FaHandHoldingUsdIcon");
            }}
            className="col-span-3 flex  text-center justify-center"
          >
            <FaHandHoldingUsd></FaHandHoldingUsd>
          </button>
        </div>
      </div>
    </>
  );
}

export function ConvertIconToJSX(iconString: string) {
  if (!iconString) return <MdInsertEmoticon></MdInsertEmoticon>;
  switch (iconString.trim()) {
    case "GiHeartEarringsIcon":
      return <GiHeartEarrings></GiHeartEarrings>;
    case "GiMealIcon":
      return <GiMeal></GiMeal>;
    case "IoRestaurantIcon":
      return <IoRestaurant></IoRestaurant>;
    case "GiBeerSteinIcon":
      return <GiBeerStein></GiBeerStein>;
    case "IoIosCafeIcon":
      return <IoIosCafe></IoIosCafe>;
    case "FaTrainTramIcon":
      return <FaTrainTram></FaTrainTram>;
    case "AiFillMedicineBoxIcon":
      return <AiFillMedicineBox></AiFillMedicineBox>;
    case "FaGasPumpIcon":
      return <FaGasPump></FaGasPump>;
    case "FaScrewdriverWrenchIcon":
      return <FaScrewdriverWrench></FaScrewdriverWrench>;
    case "GiClothesIcon":
      return <GiClothes></GiClothes>;
    case "SiElectronIcon":
      return <SiElectron></SiElectron>;
    case "GiPayMoneyIcon":
      return <GiPayMoney></GiPayMoney>;
    case "BsHouseDoorFillIcon":
      return <BsHouseDoorFill></BsHouseDoorFill>;
    case "GiCampingTentIcon":
      return <GiCampingTent></GiCampingTent>;
    case "FaBabyIcon":
      return <FaBaby></FaBaby>;
    case "BsFillTelephoneFillIcon":
      return <BsFillTelephoneFill></BsFillTelephoneFill>;
    case "IoFootballIcon":
      return <IoFootball></IoFootball>;
    case "ImBookIcon":
      return <ImBook></ImBook>;
    case "TfiCutIcon":
      return <TfiCut></TfiCut>;
    case "GiMicrophoneIcon":
      return <GiMicrophone></GiMicrophone>;
    case "MdHealthAndSafetyIcon":
      return <MdHealthAndSafety></MdHealthAndSafety>;
    case "BiRunIcon":
      return <BiRun></BiRun>;
    case "GiLoveLetterIcon":
      return <GiLoveLetter></GiLoveLetter>;
    case "FaDogIcon":
      return <FaDog></FaDog>;
    case "IoDiceSharpIcon":
      return <IoDiceSharp></IoDiceSharp>;
    case "GiLipstickIcon":
      return <GiLipstick></GiLipstick>;
    case "ImCoinDollarIcon":
      return <ImCoinDollar></ImCoinDollar>;
    case "FaHandHoldingWaterIcon":
      return <FaHandHoldingWater></FaHandHoldingWater>;
    case "FaShoppingCartIcon":
      return <FaShoppingCart></FaShoppingCart>;
    case "MdOutlineElectricBoltIcon":
      return <MdOutlineElectricBolt></MdOutlineElectricBolt>;
    case "FaPeopleCarryBoxIcon":
      return <FaPeopleCarryBox></FaPeopleCarryBox>;
    case "GiDeadHeadIcon":
      return <GiDeadHead></GiDeadHead>;
    case "GiTakeMyMoneyIcon":
      return <GiTakeMyMoney></GiTakeMyMoney>;
    case "GiSellCardIcon":
      return <GiSellCard></GiSellCard>;
    case "FaHandHoldingUsdIcon":
      return <FaHandHoldingUsd></FaHandHoldingUsd>;
    default:
      return <MdInsertEmoticon></MdInsertEmoticon>;
  }
}
