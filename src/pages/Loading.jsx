import React from "react";
import { Bars } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center align-middle">
      <Bars color="white" />
    </div>
  );
};

export default Loading;
