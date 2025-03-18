"use client";
import TitleComp from "@/components/ui/title-comp";
import React, { useEffect, useState } from "react";
import HeaderCard from "../products/sections/HeaderCard";
import OrdersTable from "@/components/orders_table/OrderTable";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { FIREBASE_DB } from "@/firebase/config";
import { collection } from "firebase/firestore";
import { orderType } from "@/common/types/docs.types";

const page = () => {
  const [snapshot, loading, error] = useCollectionOnce(
    collection(FIREBASE_DB, "orders"),
    {}
  );
  const [totalPendingOrders, setTotalPendingOrders] = useState(0);
  const [totalDeliveredOrders, setTotalDeliveredOrders] = useState(0);

  useEffect(() => {
    if (snapshot) {
      snapshot.docs.map((doc: any) => {
        let p: orderType = doc.data();
        if (p.delivered) {
          setTotalDeliveredOrders((prev) => prev + 1);
        } else {
          setTotalPendingOrders((prev) => prev + 1);
        }
      });
    }
  }, [snapshot]);

  return (
    <div className="w-full p-4 ">
      <TitleComp title="Orders" />
      <div className="mt-3 mb-12 grid lg:grid-cols-4 md:grid-cols-2 gap-5">
        <HeaderCard
          headerTitle="Total Orders"
          subTitle={snapshot?.docs.length.toString() as any}
          //   Icon={TbBrandProducthunt}
        />
        <HeaderCard
          headerTitle="Pending orders"
          subTitle={totalPendingOrders.toString()}
          //   Icon={ImPriceTags}
        />
        <HeaderCard
          headerTitle="Completed orders"
          subTitle={totalDeliveredOrders.toString()}
          //   Icon={ImPriceTags}
        />
      </div>
      <div className="w-full overflow-x-visible md:overflow-x-hidden">
        <OrdersTable />
      </div>
    </div>
  );
};

export default page;
