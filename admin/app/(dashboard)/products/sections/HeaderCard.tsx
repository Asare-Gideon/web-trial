import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface props {
  headerTitle: string;
  subTitle: string;
  Icon?: any;
}

const HeaderCard = ({ headerTitle, subTitle, Icon }: props) => {
  return (
    <Card className="w-full hover:shadow-md cursor-pointer">
      <CardContent>
        <div className=" flex justify-between p-2">
          <h1 className="text-lg font-normal">{headerTitle}</h1>
          {Icon && <Icon className="text-2xl text-red-300" />}
        </div>
        <div>
          <h1 className="text-2xl ml-3 font-[700] koho-B">{subTitle}</h1>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeaderCard;
