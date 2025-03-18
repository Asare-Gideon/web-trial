import React from "react";
import bgImg from "../../../public/images/banners/auth-bg.jpg";
import Image from "next/image";
import FormCard from "./sections/FormCard";

const Page: React.FC<any> = () => {
  return (
    <div className="min-h-[100vh] overflow-x-hidden">
      <div className="bg-primary relative h-screen w-full flex justify-center items-center">
        <div className="max-w-[30rem] w-full bg-white h-full sm:h-auto p-4 pt-5 sm:pt-0 sm:p-0  sm:rounded-2xl">
          <FormCard />
        </div>
      </div>
    </div>
  );
};

export default Page;
