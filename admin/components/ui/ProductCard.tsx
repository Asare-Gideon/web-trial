import Image from "next/image";
import React from "react";
import image from "../../public/images/bg-img/img-product-12.png";

const ProductCard = () => {
  return (
    <div className="p-3  cursor-pointer shadow-md duration-500 hover:scale-[1.02] flex-col items-center flex w-full overflow-hidden rounded-md">
      <div className="bg-[#f8f2f0] relative w-full h-[300px]">
        <Image src={image} className=" rounded-t-md" fill alt="" />
      </div>
      <div className="bg-gray-100  w-full p-1 rounded-b-md">
        <h3 className="text-lg font-normal">Viasun soap</h3>
        <h3 className="text-lg font-normal">$10</h3>
      </div>
    </div>
  );
};

export default ProductCard;
