import Image from "next/image";
import { Router, useRouter } from "next/router";
import React from "react";
const img = require("../../public/icons/checked.png");

const PaymentSuccess = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Image src={img} alt="img" height={70} width={70} />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your transaction was successful.
        </p>
        <button
          onClick={() => router.replace("/")}
          className="px-10 py-2 text-primary rounded-md hover:bg-primary hover:text-white border transition duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
