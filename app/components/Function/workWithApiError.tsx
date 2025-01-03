import React from "react";
import { toast } from "react-toastify";

export default function handleApiErrorAndRemoveLocalstorage(error: any) {
  if (
    error.response &&
    error.response.data.message === "Signature has expired!"
  ) {
    localStorage.clear();
    return toast.error(
      () => (
        <>
          <span>{error.response.data.message}</span>
          <a className="underline pl-1 font-bold" href="/api/logout">
            Re-Login Here
          </a>
        </>
      ),
      { autoClose: false }
    );
  }
  return toast.error("Something went wrong!");
}

export function handleApiErrorPromiseAndRemoveLocalstorage(error: any) {
  if (
    error.response &&
    error.response.data.message === "Signature has expired!"
  ) {
    localStorage.clear();
    return (
      <>
        <span>{error.response.data.message}</span>
        <a className="underline pl-1 font-bold" href="/api/logout">
          Re-Login Here
        </a>
      </>
    );
  }
  return "Something went wrong!";
}
export function showToastErrorContent(
  errorContent: string,
  containerId?: string
) {
  toast.error(errorContent, {
    autoClose: 1700,
    containerId: containerId,
  });
}

export function showToastSuccessContent(successContent: string) {
  toast.success(successContent, {
    autoClose: 1700,
  });
}
