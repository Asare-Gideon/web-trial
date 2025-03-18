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
import ContactTable from "@/components/contact_table/ContactTable";

const Page = () => {
  const [snapshot, loading, error] = useCollectionOnce(
    collection(FIREBASE_DB, "contacts"),
    {}
  );
  const [totalHiddenBlogs, setTotalHiddenBlogs] = useState(0);
  const [totalShowingBlogs, setTotalShowingBlosgs] = useState(0);

  return (
    <div className="w-full p-4 ">
      <TitleComp title="Contacts" />
      <div className="mt-3 mb-12 grid lg:grid-cols-4 md:grid-cols-2 gap-5">
        <HeaderCard
          headerTitle="Total contacts"
          subTitle={snapshot?.docs.length.toString() as any}
          Icon={TbBrandProducthunt}
        />
      </div>
      <div className="w-full overflow-x-visible md:overflow-x-hidden">
        <ContactTable />
      </div>
    </div>
  );
};

export default Page;
