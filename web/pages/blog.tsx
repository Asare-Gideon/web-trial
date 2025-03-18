import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ReactLoading from "react-loading";
import { Menu } from "@headlessui/react";
import DownArrow from "../public/icons/DownArrow";

import AppHeader from "../components/Header/AppHeader";
import { GetStaticProps } from "next";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { BlogCard } from "../components/BlogCard/BlogCard";
import blogImg1 from "../public/bg-img/img-article-intro-1.jpg";
import blogImg2 from "../public/bg-img/img-article-intro-4.jpg";
import blogImg3 from "../public/bg-img/img-article-intro-3.jpg";
import blogbg from "../public/bg-img/blog-bg.jpg";
import newblogImg from "../public/bg-img/newblog.jpg";
import { usePagination } from "../hooks/usePagination";
import { blogType } from "../common/types";
import {
  collection,
  DocumentData,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { BLOG_REF, FIREBASE_DB } from "../firebase/config";
import Pagination from "../components/Util/Pagination";
import { useEffect, useState } from "react";
import Banner from "../components/blog-2-ui/Banner";
import BlogPost from "../components/blog-2-ui/BlogPost";
import { useRouter } from "next/navigation";
import { useCollection } from "react-firebase-hooks/firestore";

const PAGE_SIZE = 10;

const Blog = () => {
  const [pageCount, setPageCount] = useState(1);
  const [queryInfo, setQueryInfo] = useState({
    total: 0,
    totalPages: 1,
  });
  const [gridView, setGridView] = useState(3);
  const { items, isLoading, isStart, isEnd, getPrev, getNext } =
    usePagination<blogType>(query(BLOG_REF, where("visible", "==", true)), {
      limit: PAGE_SIZE,
    });

  const handleNextPage = () => {
    if (!isEnd) {
      getNext();
      setPageCount((prev) => prev + 1);
    }
  };
  const handlePrevPage = () => {
    if (!isStart) {
      getPrev();
      setPageCount((prev) => prev - 1);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await getCountFromServer(BLOG_REF);
      const total = response.data().count;
      setQueryInfo({
        total,
        totalPages: total > PAGE_SIZE ? Math.ceil(total / PAGE_SIZE) : 1,
      });
    })();
  }, []);

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`Blog`} transparent />
      <Banner />

      {isLoading ? (
        <>
          <div className="w-full h-44 flex items-center justify-center ">
            <ReactLoading
              type={"bars"}
              color={"#db9175"}
              height={"60px"}
              width={"60px"}
            />
          </div>
        </>
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* <input
            type="text"
            placeholder="Search..."
            className="w-full mb-8 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          /> */}
          <div className="flex justify-end mb-8 bg-white"></div>
          <div className="app-x-padding app-max-width w-full mt-8">
            <div className="flex flex-col-reverse sm:flex-row mb-4 md:-ml-9 gap-4 sm:gap-0 justify-between mt-4 sm:mt-6">
              <CategoriesMenu />
            </div>
          </div>
          <div
            className={`grid grid-cols-1 ${
              gridView === 2 ? "md:grid-cols-2" : ""
            } ${gridView === 3 ? "md:grid-cols-2 lg:grid-cols-3" : ""} gap-6`}
          >
            {items.map((item) => (
              <BlogPost
                view={gridView}
                key={item.id}
                blog={{
                  id: item.id,
                  title: item.blogData.title,
                  image: item.blogData.images[0],
                  blogType: item.blogData.blogType as any,
                  date: item.date,
                  message: item.blogData.message as any,
                  publishedAt: item.publishedAt,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const CategoriesMenu = ({}) => {
  const router = useRouter();
  const category = "All Blogs";
  const [catId, setCatId] = useState(null);
  const [categoriesData, setCategoriesData] = useState<
    { id: string; name: string }[] | undefined
  >();
  const [categories, CategoriesLoading, CategoryError] = useCollection(
    collection(FIREBASE_DB, "blog_types"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    if (categories) {
      let newCatList: DocumentData = [];
      categories.docs.map((doc) => {
        newCatList.push({ ...doc.data(), id: doc.id });
      });
      setCategoriesData(newCatList as any);
    }
  }, [categories]);

  const handleTogle = (id: string, name: string) => {
    setCatId(id as any);
    router.push(`/blog-type/${name}`);
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button as="a" href="#" className="flex items-center capitalize">
        {catId === null ? "All Blogs" : category} <DownArrow />
      </Menu.Button>
      <Menu.Items className="flex flex-col z-10 items-start text-xs sm:text-sm w-auto sm:right-0 absolute p-1 border border-gray200 bg-white mt-2 outline-none">
        {categoriesData?.map((cat) => (
          <Menu.Item key={cat.id}>
            <button
              type="button"
              onClick={() => handleTogle(cat.id, cat.name)}
              className={`${
                false ? "bg-gray100 text-gray500" : "bg-white"
              } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap hover:bg-gray500 hover:text-gray100 ${
                catId === cat.id && "bg-gray500 text-gray100"
              }`}
            >
              {cat.name}
            </button>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default Blog;
