import React from "react";
import Sidebar from "../layout/Sidebar";
const Home = () => {
  return (
    <div
      className="flex w-full h-screen justify-start flex-col md:flex-row md:justify-center p-0 md:p-10"
      style={{
        backgroundColor: "rgba(7,11,41,1)",
      }}
    >
      <div className="flex text-white md:hidden">menu</div>
      <div className="hidden md:flex w-1/3 justify-end items-start ">
        <Sidebar />
      </div>
      <div className="hidden md:flex w-full justify-start items-start">
        내용
      </div>
    </div>
  );
};

export default Home;
