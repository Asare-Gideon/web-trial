import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Image from "next/image";
import Footer from "../components/Footer/Footer";
import { useSearchParams } from "next/navigation";
import { useDocument } from "react-firebase-hooks/firestore";
import { BLOG_REF, BLOG_TYPE_REF } from "../firebase/config";
import { doc, query, where } from "firebase/firestore";
import ReactLoading from "react-loading";
import { blogType } from "../common/types";
import Link from "next/link";
import { usePagination } from "../hooks/usePagination";

const PAGE_SIZE = 5;
const Blogdetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as any;
  const [blogData, setBlogData] = useState<blogType | undefined>();
  const [value, blogLoading, error] = useDocument(
    id ? doc(BLOG_REF, id) : null,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const { items, isLoading, isStart, isEnd, getPrev, getNext } =
    usePagination<blogType>(query(BLOG_REF, where("visible", "==", true)), {
      limit: PAGE_SIZE,
    });
  const {
    items: blogTypes,
    isLoading: blogTypeLoading,
    isStart: blogStart,
    isEnd: blogIsEnd,
    getPrev: blogPrev,
    getNext: blogNext,
  } = usePagination<{ name: string; id: string; date: any }>(
    query(BLOG_TYPE_REF),
    {
      limit: 30,
    }
  );

  useEffect(() => {
    setBlogData(value?.data() as any);
  }, [value]);

  return (
    <div className="">
      <Header title="About Details - Template" transparent={true} />
      {blogLoading ? (
        <>
          <div className="w-full h-screen flex items-center justify-center ">
            <ReactLoading
              type={"bars"}
              color={"#db9175"}
              height={"60px"}
              width={"60px"}
            />
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-8  lg:py-16">
          <div className="lg:flex lg:space-x-8">
            <main className="flex-1">
              <div className="mb-4">
                {/* <Image
                  src={blogData?.blogData.images[0]}
                  alt={blogData?.blogData.title as any}
                  width={1200}
                  height={600}
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                /> */}
              </div>
              <h1 className="text-4xl mt-24   font-bold  mb-2">
                {blogData?.blogData.title}
              </h1>
              <div className="flex items-center">
                {blogData?.blogData.blogType.map((type, index) => (
                  <p className="text-gray-600 ml-1">
                    {type}{" "}
                    {index != blogData.blogData.blogType.length - 1 && ","}{" "}
                  </p>
                ))}
              </div>
              <p className="text-gray-600 mb-8">
                {blogData?.publishedAt.toDate().toDateString()}
              </p>
              <div className="prose lg:prose-xl max-w-none">
                <div className="blog-content px-4 lg:px-0 mt-12 text-gray-700 text-lg leading-relaxed w-full lg:w-3/4 overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: blogData?.blogData.message as any,
                    }}
                  ></div>
                </div>
              </div>
            </main>
            <aside className="lg:w-1/4 bg-white p-4 mt-8 lg:mt-0 sticky top-28 self-start">
              <div className="w-full mb-8"></div>
              <Image
                src={blogData?.blogData.images[0]}
                className=" hidden md:flex w-full h-60 object-cover"
                height={250}
                width={200}
                alt="img"
              />
              <h2 className="text-lg mt-8 font-semibold mb-4">Blog Types</h2>
              <ul className="flex flex-col bg-white   border-gray300">
                {blogTypes.map((type) => (
                  <Link
                    className="text-lg font-normal my-2"
                    href={`/blog-type/${type.name}`}
                  >
                    {type.name}
                  </Link>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Blogdetails;
