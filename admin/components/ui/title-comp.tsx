import React from "react";

const TitleComp = ({ title }: { title: string }) => {
  return (
    <div>
      <h2 className="lg:text-lg font-[700] font-Koho-B">{title}</h2>
    </div>
  );
};

export default TitleComp;
