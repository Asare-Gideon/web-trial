import React, { useEffect, useState } from "react";
import { nameShortner } from "../../common/nameShortner";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface BlogPostProps {
  view: number;
  route?: string;
  blog: {
    id: string;
    image: any;
    blogType: string;
    date: any;
    publishedAt: any;
    title: string;
    message: string;
  };
}

const BlogPost: React.FC<BlogPostProps> = ({ view, blog, route }) => {
  const [description, setDescription] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    let newdes = blog.message
      .replace(/(<([^>]+)>)/gi, "[caps]")
      .split("[caps]")
      .filter((x) => x != "");
    setDescription(newdes.join(" "));
  }, [blog]);
  // console.log(description[1]);

  let containerClasses =
    "bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform  cursor-pointer mb-5 ";
  let imageClasses = "w-full h-56 object-cover";
  let contentClasses = "p-6";
  let titleClasses = "text-2xl font-bold mb-3";
  let dateClasses = "text-gray-600 text-sm mb-4";
  let descriptionClasses = "text-gray-700";

  if (view === 1) {
    containerClasses =
      "bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 cursor-pointer";
    imageClasses = "w-full h-64 object-cover";
    contentClasses = "p-8";
    titleClasses = "text-3xl font-bold mb-4";
    dateClasses = "text-gray-500 text-md mb-4";
    descriptionClasses = "text-gray-800 text-lg";
  } else if (view === 2) {
    containerClasses =
      "bg-white rounded-lg overflow-hidden shadow-md transform transition-transform hover:scale-105 cursor-pointer";
    imageClasses = "w-full h-48 object-cover";
    contentClasses = "p-6";
    titleClasses = "text-2xl font-bold mb-2";
    dateClasses = "text-gray-500 text-sm mb-2";
    descriptionClasses = "text-gray-700 text-base";
  } else if (view === 3) {
    containerClasses =
      "bg-white rounded-lg overflow-hidden shadow-sm transform transition-transform hover:scale-105 cursor-pointer ";
    imageClasses = "w-full h-52 object-cover";
    contentClasses = "p-4";
    titleClasses = "text-xl font-bold mb-2";
    dateClasses = "text-gray-500 text-xs mb-2";
    descriptionClasses = "text-gray-700 text-sm";
  }

  const handleRouteChang = () => {
    if (route) {
      router.push(`${route}?id=${blog.id}`);
    } else {
      router.push(`/blogdetails?id=${blog.id}`);
    }
  };

  return (
    <div className={containerClasses} onClick={handleRouteChang}>
      <Image
        height={200}
        width={200}
        layout={view == 3 ? "" : "responsive"}
        className={imageClasses}
        src={blog.image}
        alt="Blog Post"
      />
      <div className={contentClasses}>
        <p className={dateClasses}>
          Published on: {blog.publishedAt?.toDate().toDateString()}
        </p>
        <h2 className={titleClasses}>{blog.title}</h2>
        <Link
          href={route ? `${route}?id=${blog.id}` : `/blogdetails?id=${blog.id}`}
          className="text-blue-500  mt-4 inline-block text-gray500"
        >
          Continue Reading
        </Link>
      </div>
    </div>
  );
};

export default BlogPost;
