import React, { Component } from "react";

export default class Loading extends Component {
  render() {
    return (
      <div className="flex items-center justify-center w-auto ">
        <div className="px-3 py-1  text-xl font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
          loading...
        </div>
      </div>
    );
  }
}
