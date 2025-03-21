import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import ReactLoading from "react-loading";

import Heart from "../../public/icons/Heart";
import DownArrow from "../../public/icons/DownArrow";
import FacebookLogo from "../../public/icons/FacebookLogo";
import InstagramLogo from "../../public/icons/InstagramLogo";
import Header from "../../components/Header/Header";
import GhostButton from "../../components/Buttons/GhostButton";
import Button from "../../components/Buttons/Button";
import Card from "../../components/Card/Card";

// swiperjs
import { Swiper, SwiperSlide } from "swiper/react";

// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper/core";
import { apiProductsType, itemType } from "../../context/cart/cart-types";
import { useWishlist } from "../../context/wishlist/WishlistProvider";
import { useCart } from "../../context/cart/CartProvider";
import HeartSolid from "../../public/icons/HeartSolid";
import Items from "../../components/Util/Items";
import Footer from "../../components/Footer/Footer";
import { Router, useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { FIREBASE_AUTH, FIREBASE_DB, PRODUCT_REF } from "../../firebase/config";
import { doc, query, where } from "firebase/firestore";
import { ProductType } from "../../common/types";
import { usePagination } from "../../hooks/usePagination";
import { useAuthState } from "react-firebase-hooks/auth";
// install Swiper modules
SwiperCore.use([Pagination]);

type Props = {
  product: itemType;
  products: itemType[];
};
const PAGE_SIZE = 5;

const Product: React.FC<Props> = () => {
  const router = useRouter();
  const [productData, setProductData] = useState<ProductType | undefined>();
  const [product, setProduct] = useState<itemType | undefined>();
  const [productCategory, setProductCategory] = useState<string | undefined>();
  const [isAddOne, setIsAddOne] = useState(true);
  const { id } = router.query;
  const img1 = product?.img1;
  const img2 = product?.img2;
  const [value, productLoading, error] = useDocument(
    id ? doc(FIREBASE_DB, "courses", id?.toString()) : null,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const { items, isLoading, isStart, isEnd, getPrev, getNext } =
    usePagination<ProductType>(
      productCategory
        ? query(
            PRODUCT_REF,
            where("visible", "==", true),
            where("courseData.category", "==", productCategory)
          )
        : query(PRODUCT_REF, where("visible", "==", true)),
      {
        limit: PAGE_SIZE,
      }
    );

  const { addItem, addOne } = useCart();
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const [size, setSize] = useState("M");
  const [mainImg, setMainImg] = useState(img1);
  const [currentQty, setCurrentQty] = useState(1);
  const [newItem, setNewItem] = useState<itemType>();
  const [isBought, setIsBought] = useState(false);
  const [user, loading] = useAuthState(FIREBASE_AUTH);

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === product?.id).length > 0;

  useEffect(() => {
    setProductData(value?.data() as any);
  }, [value]);

  useEffect(() => {
    setProduct({
      id: productData?.id as any,
      name: productData?.courseData.title as any,
      price: productData?.courseData.price as any,
      category: productData?.courseData.category,
      date: productData?.date as any,
      description: productData?.courseData.description,
      img1: productData?.courseData.thumbnails[0],
      img2: productData?.courseData.thumbnails[0],
      qty: 0,
    });
    setNewItem({
      id: productData?.id as any,
      name: productData?.courseData.title as any,
      price: productData?.courseData.price as any,
      category: productData?.courseData.category,
      date: productData?.date as any,
      description: productData?.courseData.description,
      img1: productData?.courseData.thumbnails[0],
      img2: productData?.courseData.thumbnails[0],
    });
    setProductCategory(productData?.courseData.category);
  }, [productData]);

  useEffect(() => {
    setMainImg(product?.img1);
  }, [product]);

  useEffect(() => {
    if (productData?.purchaseUsers) {
      if (productData.purchaseUsers.find((it) => it === user?.email)) {
        setIsBought(true);
      }
    }
  }, [productData]);

  const handleSize = (value: string) => {
    setSize(value);
  };

  const currentItem = {
    ...product,
    qty: currentQty,
    size: size,
  };

  const handleWishlist = () => {
    alreadyWishlisted
      ? deleteWishlistItem!(currentItem as any)
      : addToWishlist!(currentItem as any);
  };

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`${product?.name} Query Education `} transparent={true} />

      {productLoading || !product ? (
        <div className="w-full h-screen flex items-center justify-center ">
          <ReactLoading
            type={"bars"}
            color={"#db9175"}
            height={"60px"}
            width={"60px"}
          />
        </div>
      ) : (
        <main id="main-content">
          {/* ===== Breadcrumb Section ===== */}
          <div className="bg-lightgreen h-16 w-full flex items-center border-t-2 border-gray200">
            <div className="app-x-padding app-max-width w-full">
              <div className="breadcrumb">
                <Link href="/">
                  <span className="text-gray400">home</span>
                </Link>{" "}
                /{" "}
                <Link href={`/product-category/${product?.category}`}>
                  <span className="text-gray400 capitalize">
                    {product?.category as string}
                  </span>
                </Link>{" "}
                / <span>{product?.name}</span>
              </div>
            </div>
          </div>
          {/* ===== Main Content Section ===== */}
          <div className="itemSection app-max-width app-x-padding flex flex-col md:flex-row">
            <div className="imgSection w-full md:w-1/2 h-full flex">
              <div className="hidden sm:block w-full sm:w-1/4 h-full space-y-4 my-4">
                <Image
                  className={`cursor-pointer ${
                    mainImg === img1
                      ? "opacity-100 border border-gray300"
                      : "opacity-50"
                  }`}
                  onClick={() => setMainImg(img1)}
                  src={img1 as string}
                  alt={product ? product.name : "img"}
                  width={1000}
                  height={1282}
                />
                <Image
                  className={`cursor-pointer ${
                    mainImg === img2
                      ? "opacity-100 border border-gray300"
                      : "opacity-50"
                  }`}
                  onClick={() => setMainImg(img2)}
                  src={img2 as string}
                  alt={product ? product.name : "img"}
                  width={1000}
                  height={1282}
                />
              </div>
              <div className="w-full sm:w-3/4 h-full m-0 sm:m-4">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={0}
                  loop={true}
                  pagination={{
                    clickable: true,
                  }}
                  className="mySwiper sm:hidden"
                >
                  <SwiperSlide>
                    <Image
                      className="each-slide w-full"
                      src={img1 as string}
                      width={1000}
                      height={1282}
                      alt={product ? product.name : "img"}
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Image
                      className="each-slide w-full"
                      src={img2 as string}
                      width={1000}
                      height={1282}
                      alt={product ? product.name : "img"}
                    />
                  </SwiperSlide>
                </Swiper>
                <div className="hidden sm:block h-full">
                  <Image
                    className="w-full"
                    src={mainImg as string}
                    width={1000}
                    height={1282}
                    alt={product ? product.name : "img"}
                  />
                </div>
              </div>
            </div>
            <div className="infoSection w-full md:w-1/2 h-auto py-8 sm:pl-4 flex flex-col">
              <h1 className="text-3xl mb-4">{product?.name}</h1>
              <span className="text-2xl text-gray400 mb-2">
                $ {product?.price}
              </span>
              <span className="mb-2 text-justify">
                {" "}
                <div
                  dangerouslySetInnerHTML={{
                    __html: product?.description as any,
                  }}
                ></div>
              </span>
              <span className="mb-2">availability: in_stock</span>
              {/* <span className="mb-2">size: {size}</span> */}
              {/* <div className="sizeContainer flex space-x-4 text-sm mb-4">
                <div
                  onClick={() => handleSize("S")}
                  className={`w-8 h-8 flex items-center justify-center border ${
                    size === "S"
                      ? "border-gray500"
                      : "border-gray300 text-gray400"
                  } cursor-pointer hover:bg-gray500 hover:text-gray100`}
                >
                  S
                </div>
                <div
                  onClick={() => handleSize("M")}
                  className={`w-8 h-8 flex items-center justify-center border ${
                    size === "M"
                      ? "border-gray500"
                      : "border-gray300 text-gray400"
                  } cursor-pointer hover:bg-gray500 hover:text-gray100`}
                >
                  M
                </div>
                <div
                  onClick={() => handleSize("L")}
                  className={`w-8 h-8 flex items-center justify-center border ${
                    size === "L"
                      ? "border-gray500"
                      : "border-gray300 text-gray400"
                  } cursor-pointer hover:bg-gray500 hover:text-gray100`}
                >
                  L
                </div>
              </div> */}
              <div className="addToCart flex flex-col sm:flex-row md:flex-col lg:flex-row space-y-4 sm:space-y-0 mb-4">
                {/* <div className="plusOrMinus h-12 flex border justify-center border-gray300 divide-x-2 divide-gray300 mb-4 mr-0 sm:mr-4 md:mr-0 lg:mr-4">
                  <div
                    onClick={() => {
                      setCurrentQty((prevState) => prevState - 1);
                      setIsAddOne(false);
                    }}
                    className={`${
                      currentQty === 1 && "pointer-events-none"
                    } h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray500 hover:text-gray100`}
                  >
                    -
                  </div>
                  <div className="h-full w-28 sm:w-12 flex justify-center items-center pointer-events-none">
                    {currentQty}
                  </div>
                  <div
                    onClick={() => {
                      setCurrentQty((prevState) => prevState + 1);
                      setIsAddOne(false);
                    }}
                    className="h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray500 hover:text-gray100"
                  >
                    +
                  </div>
                </div> */}
                <div className="flex h-12 space-x-4 w-full">
                  {isBought || product.price === 0 ? (
                    <Button
                      value={product.price === 0 ? "Free Course" : "Subscribed"}
                      size="lg"
                      extraClass={`flex-grow text-center whitespace-nowrap`}
                    />
                  ) : (
                    <Button
                      value={
                        isAddOne
                          ? "Add to carts"
                          : `Add addictional ${currentQty}`
                      }
                      size="lg"
                      extraClass={`flex-grow text-center whitespace-nowrap`}
                      onClick={() => {
                        if (isAddOne) {
                          addOne!(newItem as any);
                        } else {
                          addItem!(currentItem as any);
                          setIsAddOne(true);
                        }
                      }}
                    />
                  )}
                  <GhostButton onClick={handleWishlist}>
                    {alreadyWishlisted ? (
                      <HeartSolid extraClass="inline" />
                    ) : (
                      <Heart extraClass="inline" />
                    )}
                  </GhostButton>
                </div>
              </div>
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="py-2 focus:outline-none text-left mb-4 border-b-2 border-gray200 flex items-center justify-between">
                      <span>details</span>
                      <DownArrow
                        extraClass={`${
                          open ? "" : "transform rotate-180"
                        } w-5 h-5 text-purple-500`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel
                      className={`text-gray400 animate__animated animate__bounceIn`}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product?.description as any,
                        }}
                      ></div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <div className="flex items-center space-x-4 mt-4">
                <span>share</span>
                <FacebookLogo extraClass="h-4 cursor-pointer text-gray400 hover:text-gray500" />
                <InstagramLogo extraClass="h-4 cursor-pointer text-gray400 hover:text-gray500" />
              </div>
            </div>
          </div>
          {/* ===== Horizontal Divider ===== */}
          <div className="border-b-2 border-gray200"></div>

          {/* ===== You May Also Like Section ===== */}
          {isLoading ? (
            <div className="w-full h-36 flex items-center justify-center ">
              <ReactLoading
                type={"bars"}
                color={"#db9175"}
                height={"60px"}
                width={"60px"}
              />
            </div>
          ) : (
            <div className="recSection my-8 app-max-width app-x-padding">
              <h2 className="text-3xl mb-6">You may also like</h2>
              <Swiper
                slidesPerView={2}
                // centeredSlides={true}
                spaceBetween={10}
                loop={true}
                grabCursor={true}
                pagination={{
                  clickable: true,
                  type: "bullets",
                }}
                className="mySwiper card-swiper sm:hidden"
              >
                {items.map((item: any) => (
                  <SwiperSlide key={item.id}>
                    <div className="mb-6">
                      <Card key={item.id} item={item} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-20 sm:gap-y-16 mb-10">
                {items.map((item: any) => (
                  <Card key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export default Product;
