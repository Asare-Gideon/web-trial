import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

interface props {
  headerTitle: string;
  subTitle: string;
  Icon?: any;
  route?: string;
}

const DashboardCard = ({ headerTitle, subTitle, Icon, route }: props) => {
  return (
    <Card className="w-full relative hover:shadow-md cursor-pointer py-3">
      <CardContent>
        <div className=" flex justify-between p-2">
          <h1 className="text-lg font-normal">{headerTitle}</h1>
          {Icon && <Icon className="text-2xl text-red-300" />}
        </div>
        <div>
          <h1 className="text-3xl ml-3 font-[700] koho-B">{subTitle}</h1>
        </div>
      </CardContent>
      <div className=" absolute bg-primary w-[5rem] h-[3rem] top-0 right-0 rounded-bl-[2rem]"></div>
      {route && (
        <Link
          href={route}
          className=" absolute bottom-2 right-4 text-red-300 hover:text-gray-600"
        >
          <span>View more</span>
        </Link>
      )}
    </Card>
  );
};

export default DashboardCard;
