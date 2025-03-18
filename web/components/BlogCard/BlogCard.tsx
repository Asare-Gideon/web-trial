import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nameShortner } from "../../common/nameShortner";

interface BlogProps {
  blog: {
    id: string;
    image: any;
    blogType: string;
    date: any;
    title: string;
    message: string;
  };
}

export const BlogCard = ({ blog }: BlogProps) => {
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    let newdes = blog.message
      .replace(/(<([^>]+)>)/gi, "[caps]")
      .split("[caps]")
      .filter((x) => x != "");
    setDescription(newdes.join(" "));
  }, [blog]);
  // console.log(description[1]);

  return (
    <div className="flex flex-col items-start col-span-12 space-y-3 sm:col-span-6 xl:col-span-4">
      <div className="relative h-64 w-full">
        <Image
          src={blog.image}
          // height={100}
          // width={100}
          // layout="responsive"
          fill
          alt="img"
        />
      </div>
      <p className="bg-green-500 flex items-center leading-none text-sm font-medium text-gray-50 pt-1.5 pr-3 pb-1.5 pl-3rounded-full uppercase inline-block">
        {blog.blogType}
      </p>
      <Link
        href={`/blogdetails?id=${blog.id}`}
        className="text-lg hover:text-primary font-bold sm:text-xl md:text-xl"
      >
        {blog.title}
      </Link>
      <p className="text-sm lg:text-md text-black">
        {nameShortner(description, 100)}
      </p>
      <div className="pt-2 pr-0 pb-0 pl-0">
        <p className="inline text-xs font-medium mt-0 mr-1 mb-0 ml-1">
          {blog.date?.toDate().toDateString()}
        </p>
      </div>
    </div>
  );
};
