import axios from "axios";
import handleApiErrorAndRemoveLocalstorage from "./workWithApiError";

export default async function fetchDataWithEndPoint(
  endPoint: string,
  para?: any
) {
  try {
    const response = await axios.get(endPoint, {
      headers: {
        Authorization: localStorage.getItem("jwt_token") || null,
      },

      params: para,
    });

    if (response.data.result !== "Nothing data") {
      return response.data;
    }
    return null;
  } catch (error) {
    handleApiErrorAndRemoveLocalstorage(error);
    console.error(error);
    return null;
  }
}
