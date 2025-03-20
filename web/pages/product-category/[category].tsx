"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Card/Card";
import Pagination from "../../components/Util/Pagination";
import { apiProductsType, itemType } from "../../context/cart/cart-types";
import DownArrow from "../../public/icons/DownArrow";
import { usePagination } from "../../hooks/usePagination";
import {
  DocumentData,
  collection,
  getCountFromServer,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { FIREBASE_DB, PRODUCT_REF } from "../../firebase/config";
import { ProductType } from "../../common/types";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";

type OrderType = "latest" | "price" | "price-desc";
const PAGE_SIZE = 10;

const ProductCategory = () => {
  const router = useRouter();
  const { category } = router.query;
  const isAllProducts = category === "All Courses";
  const [pageCount, setPageCount] = useState(1);
  const [queryInfo, setQueryInfo] = useState({
    total: 0,
    totalPages: 1,
  });
  const { items, isLoading, isStart, isEnd, getPrev, getNext } =
    usePagination<ProductType>(
      isAllProducts
        ? query(PRODUCT_REF, where("visible", "==", true))
        : category
        ? query(
            PRODUCT_REF,
            where("visible", "==", true),
            where("courseData.category", "==", category)
          )
        : query(PRODUCT_REF, where("visible", "==", true)),
      {
        limit: PAGE_SIZE,
      }
    );

  // console.log(isAllProducts);

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
      const response = await getCountFromServer(PRODUCT_REF);
      const total = response.data().count;
      setQueryInfo({
        total,
        totalPages: total > PAGE_SIZE ? Math.ceil(total / PAGE_SIZE) : 1,
      });
    })();
  }, []);

  return (
    <div className="">
      {/* ===== Head Section ===== */}
      <Header title={`name here - Route 11`} transparent={true} />

      <main id="main-content">
        {/* ===== Breadcrumb Section ===== */}
        <div className="bg-lightgreen h-16 w-full flex items-center">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/">
                <span className="text-gray400">home</span>
              </Link>{" "}
              / <span className="capitalize">{category as string}</span>
            </div>
          </div>
        </div>

        {/* ===== Heading & Filter Section ===== */}
        {isLoading ? (
          <div className="w-full h-screen flex items-center justify-center ">
            <ReactLoading
              type={"bars"}
              color={"#db9175"}
              height={"60px"}
              width={"60px"}
            />
          </div>
        ) : (
          <>
            <div className="app-x-padding app-max-width w-full mt-8">
              <h3 className="text-4xl mb-2 capitalize">{category as string}</h3>
              <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-0 justify-between mt-4 sm:mt-6">
                {category !== "new-arrivals" && <CategoriesMenu />}
              </div>
            </div>

            {/* ===== Main Content Section ===== */}
            <div className="app-x-padding app-max-width mt-3 mb-14">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-20 sm:gap-y-14 mb-10">
                {items.map((item) => (
                  <Card key={item.id} item={item as any} />
                ))}
              </div>
              <Pagination
                currentPage={pageCount}
                lastPage={queryInfo.totalPages}
                orderby={"latest"}
                next={handleNextPage}
                prev={handlePrevPage}
              />
            </div>
          </>
        )}
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

const SortMenu: React.FC<{ orderby: OrderType }> = ({ orderby }) => {
  const t = useTranslations("Navigation");
  const router = useRouter();
  const { category } = router.query;

  let currentOrder: string;

  if (orderby === "price") {
    currentOrder = "sort_by_price";
  } else if (orderby === "price-desc") {
    currentOrder = "sort_by_price_desc";
  } else {
    currentOrder = "sort products";
  }
  return (
    <Menu as="div" className="relative">
      <Menu.Button as="a" href="#" className="flex items-center capitalize">
        {currentOrder} <DownArrow />
      </Menu.Button>
      <Menu.Items className="flex flex-col z-10 items-start text-xs sm:text-sm w-auto sm:right-0 absolute p-1 border border-gray200 bg-white mt-2 outline-none">
        <Menu.Item>
          {({ active }) => (
            <button
              type="button"
              onClick={() =>
                router.push(`/product-category/${category}?orderby=latest`)
              }
              className={`${
                active ? "bg-gray100 text-gray500" : "bg-white"
              } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
                currentOrder === "sort_by_latest" && "bg-gray500 text-gray100"
              }`}
            >
              {"sort_by_latest"}
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              type="button"
              onClick={() =>
                router.push(`/product-category/${category}?orderby=price`)
              }
              className={`${
                active ? "bg-gray100 text-gray500" : "bg-white"
              } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
                currentOrder === "sort_by_price" && "bg-gray500 text-gray100"
              }`}
            >
              {"sort_by_price"}
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              type="button"
              onClick={() =>
                router.push(`/product-category/${category}?orderby=price-desc`)
              }
              className={`${
                active ? "bg-gray100 text-gray500" : "bg-white"
              } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
                currentOrder === "sort_by_price_desc" &&
                "bg-gray500 text-gray100"
              }`}
            >
              {"sort_by_price_desc"}
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

const CategoriesMenu = ({}) => {
  const router = useRouter();
  const { category } = router.query;
  const [catId, setCatId] = useState(null);
  const [categoriesData, setCategoriesData] = useState<
    { id: string; name: string }[] | undefined
  >();
  const [categories, CategoriesLoading, CategoryError] = useCollection(
    collection(FIREBASE_DB, "categories"),
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
    router.push(`/product-category/${name}`);
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button as="a" href="#" className="flex items-center capitalize">
        {catId === null ? "Filter category" : category} <DownArrow />
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

export default ProductCategory;
