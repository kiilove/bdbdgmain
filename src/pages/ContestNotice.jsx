import React from "react";

const ContestNotice = () => {
  return (
    <div className="flex w-full h-full">
      <div
        className="flex w-full h-full rounded-lg flex-col"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex justify-start items-center h-14 p-5">
          <span className="text-white">대회공고작성</span>
        </div>
      </div>
    </div>
  );
};

export default ContestNotice;
