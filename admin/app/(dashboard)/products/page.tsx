"use client";
import ProductsTable from "@/components/product_table/ProductsTable";
import TitleComp from "@/components/ui/title-comp";
import React, { useEffect, useState } from "react";
import HeaderCard from "./sections/HeaderCard";
import { TbBrandProducthunt } from "react-icons/tb";
import { ImPriceTags } from "react-icons/im";
import { GiFlamethrowerSoldier } from "react-icons/gi";
import { LuArrowRightLeft } from "react-icons/lu";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebase/config";
import { ProductType } from "@/common/types/docs.types";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoEyeOffOutline } from "react-icons/io5";

const Page = () => {
  const [snapshot, loading, error] = useCollectionOnce(
    collection(FIREBASE_DB, "courses"),
    {}
  );
  const [totalPQuantity, setTotalPQuantity] = useState(0);
  const [totalHiddenProducts, setTotalHiddenProducts] = useState(0);
  const [totalShowingProduts, setTotalShowingProduts] = useState(0);

  useEffect(() => {
    if (snapshot) {
      snapshot.docs.map((doc: any) => {
        let p: ProductType = doc.data();
        if (p.visible) {
          setTotalShowingProduts((prev) => prev + 1);
        } else {
          setTotalHiddenProducts((prev) => prev + 1);
        }
      });
    }
  }, [snapshot]);

  return (
    <div className="w-full p-4 ">
      <TitleComp title="Courses" />
      <div className="mt-3 mb-12 grid lg:grid-cols-4 md:grid-cols-2 gap-5">
        <HeaderCard
          headerTitle="Total Courses Quantity"
          subTitle={totalPQuantity.toString()}
          Icon={TbBrandProducthunt}
        />
        <HeaderCard
          headerTitle="Total Hidden Courses"
          subTitle={totalHiddenProducts.toString()}
          Icon={IoEyeOffOutline}
        />
        <HeaderCard
          headerTitle="Total Visible Courses"
          subTitle={totalShowingProduts.toString()}
          Icon={MdOutlineRemoveRedEye}
        />
      </div>
      <div className="w-full overflow-x-visible md:overflow-x-hidden">
        <ProductsTable />
      </div>
    </div>
  );
};

export default Page;
