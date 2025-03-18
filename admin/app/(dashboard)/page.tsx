"use client";
import { ProductType, blogType, orderType } from "@/common/types/docs.types";
import AnalyticTable from "@/components/analytics_table/AnalyticTable";
import ProductCard from "@/components/ui/ProductCard";
import DashboardCard from "@/components/ui/dashboardCard";
import TitleComp from "@/components/ui/title-comp";
import { FIREBASE_DB } from "@/firebase/config";
import { collection, query, where } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  useCollection,
  useCollectionOnce,
} from "react-firebase-hooks/firestore";

export default function Home() {
  const [deliveredOrders, setDeliveredOrders] = useState<orderType[]>();
  const [totalSale, setTotalSales] = useState<number>(0.0);
  const [snapshot, loading, error] = useCollectionOnce(
    collection(FIREBASE_DB, "products"),
    {}
  );
  const [blog, blogLoading, blogError] = useCollectionOnce(
    collection(FIREBASE_DB, "blogs"),
    {}
  );
  const [orders, ordersLoading, ordersError] = useCollection(
    query(collection(FIREBASE_DB, "orders")),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [totalPQuantity, setTotalPQuantity] = useState(0);

  useEffect(() => {
    if (orders) {
      let newOrder: orderType[] = [];
      orders.docs.forEach((v) => {
        if (v.data().delivered === true) {
          newOrder.push({ ...v.data(), id: v.id } as any);
        }
      });

      setDeliveredOrders(newOrder);
    }
  }, [orders]);

  useEffect(() => {
    if (snapshot) {
      snapshot.docs.map((doc: any) => {
        let p: ProductType = doc.data();
        setTotalPQuantity(
          (prev) => prev + parseInt(p.productData.quantity as any)
        );
      });
    }
  }, [snapshot]);

  useEffect(() => {
    let total = 0;
    deliveredOrders?.map((order) => {
      total += parseInt(order.orderTotalPrice);
    });
    setTotalSales(total);
  }, [deliveredOrders]);

  // console.log(totalPQuantity);
  return (
    <main className="p-4">
      <TitleComp title="Dashboard" />
      <div className="grid lg:grid-cols-4 md:grid-cols-2 mt-3 gap-4">
        <DashboardCard
          headerTitle="Total Courses"
          subTitle={totalPQuantity.toString()}
        />
        <DashboardCard
          headerTitle="Course Left"
          subTitle={totalPQuantity.toString()}
        />
        <DashboardCard
          headerTitle="Total Income"
          subTitle={`$${totalSale}`}
          route="/"
        />
        <DashboardCard
          headerTitle="Total Blog Posted"
          subTitle={blog?.docs.length.toString() as any}
        />
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-normal">Recent pending orders</h3>
        <div className="mt-2">
          <AnalyticTable />
        </div>
      </div>

      {/* <div className="mt-5">
        <h3 className="text-lg font-normal">Recent Blog post</h3>
        <div className="w-full p-3 h-[10rem] flex justify-center items-center bg-white"></div>
      </div> */}
    </main>
  );
}
