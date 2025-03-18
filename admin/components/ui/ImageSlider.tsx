import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export function ImageSlider({ images }: { images: string[] }) {
  // console.log(images);
  return (
    <Carousel className="w-[80%] ml-10 ">
      <CarouselContent>
        {images?.map((img, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="bg-[#f7f7f7] relative overflow-hidden shadow-none">
                <CardContent className="flex aspect-square">
                  <Image src={img} alt="img" fill />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
