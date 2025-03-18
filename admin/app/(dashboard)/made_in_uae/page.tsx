"use client";
import ProductsTable from "@/components/product_table/ProductsTable";
import TitleComp from "@/components/ui/title-comp";
import React, { useEffect, useState } from "react";
import { TbBrandProducthunt } from "react-icons/tb";
import { ImPriceTags } from "react-icons/im";
import { GiFlamethrowerSoldier } from "react-icons/gi";
import { LuArrowRightLeft } from "react-icons/lu";
import HeaderCard from "../products/sections/HeaderCard";
import BlogTable from "@/components/blog_table/BlogTable";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebase/config";
import { blogType } from "@/common/types/docs.types";
import UaeTable from "@/components/uae_table/UaeTable";

const Page = () => {
  const [snapshot, loading, error] = useCollectionOnce(
    collection(FIREBASE_DB, "made_in_uae"),
    {}
  );
  const [totalHiddenBlogs, setTotalHiddenBlogs] = useState(0);
  const [totalShowingBlogs, setTotalShowingBlosgs] = useState(0);

  useEffect(() => {
    if (snapshot) {
      snapshot.docs.map((doc: any) => {
        let p: blogType = doc.data();
        if (p.visible) {
          setTotalShowingBlosgs((prev) => prev + 1);
        } else {
          setTotalHiddenBlogs((prev) => prev + 1);
        }
      });
    }
  }, [snapshot]);

  return (
    <div className="w-full p-4 ">
      <TitleComp title="Made In UAE" />
      <div className="mt-3 mb-12 grid lg:grid-cols-4 md:grid-cols-2 gap-5">
        <HeaderCard
          headerTitle="Total UAE posted"
          subTitle={snapshot?.docs.length.toString() as any}
          Icon={TbBrandProducthunt}
        />
        <HeaderCard
          headerTitle="Showing UAE"
          subTitle={totalShowingBlogs.toString()}
          Icon={ImPriceTags}
        />
        <HeaderCard
          headerTitle="Total hidden UAE"
          subTitle={totalHiddenBlogs.toString()}
          Icon={ImPriceTags}
        />
      </div>
      <div className="w-full overflow-x-visible md:overflow-x-hidden">
        <UaeTable />
      </div>
    </div>
  );
};

export default Page;
