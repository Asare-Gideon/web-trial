import React, { useState, useEffect } from "react";
import Image from "next/image";

import Header from "../components/Header/Header";
import Slideshow from "../components/HeroSection/Slideshow";
import Card from "../components/Card/Card";
import { itemType } from "../context/cart/cart-types";

// /bg-img/ourshop.png
import aboutImage from "../public/bg-img/img-about.jpg";
import ShopCategories from "../components/ShopCategories/ShopCategories";
import Footer from "../components/Footer/Footer";
import { BlogCard } from "../components/BlogCard/BlogCard";
// console.log(Items);
import { usePagination } from "../hooks/usePagination";
import { collection, query, where } from "firebase/firestore";
import { BLOG_REF, FIREBASE_DB } from "../firebase/config";
import { blogType, ProductType } from "../common/types";
import ReactLoading from "react-loading";
import Link from "next/link";
import BlogPost from "../components/blog-2-ui/BlogPost";

type Props = {
  products: itemType[];
};

const Home: React.FC<Props> = ({ products }) => {
  const [gridView, setGridView] = useState(3);
  const { items, isLoading, isStart, isEnd, getPrev, getNext } =
    usePagination<ProductType>(
      query(collection(FIREBASE_DB, "products"), where("visible", "==", true)),
      {
        limit: 4,
      }
    );

  const {
    items: blogs,
    isLoading: blogLoading,
    isStart: blogStart,
    isEnd: blogIsEnd,
    getPrev: blogPrev,
    getNext: blogNext,
  } = usePagination<blogType>(query(BLOG_REF, where("visible", "==", true)), {
    limit: 3,
  });

  return (
    <>
      {/* ===== Header Section ===== */}
      <Header />
      <Slideshow />
      <main id="main-content" className="-mt-20">
        {/* ===== about Section ===== */}
        <div className="section-about">
          <div className="uk-section-large uk-container">
            <h1 className="text-center font-FaunaOne text-6xl font-semibold my-14 title__about relative">
              About us
            </h1>
            <div className="uk-grid uk-child-width-1-2@m" data-uk-grid>
              <div>
                <div className="section-about__media _anim">
                  <div className="relative">
                    <Image src={aboutImage} alt="" className="w-full" />
                  </div>
                </div>
              </div>
              <div>
                <div
                  className="section-about__desc"
                  data-uk-scrollspy="target: > *; cls: uk-animation-slide-bottom-small; delay: 300"
                >
                  <div className="section-title">
                    <span>Learn, Apply, Excel!</span>
                    <h3 className="font-Cormorant">
                      Making learning exciting
                    </h3>
                  </div>
                  <div className="section-content">
                    <p className="mb-8">
                      E Learning platform.
                    </p>
                    <Link
                      className="bg-primary text-center uppercase my-12 block w-fit hover:bg-black hover:text-white hover:no-underline transition-all duration-500 px-12 py-6 font-FaunaOne text-xl text-white"
                      href="/about"
                    >
                      view More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== categories Section ===== */}
        <ShopCategories />
        {/* ===== Best Selling Section ===== */}
        <section className="app-max-width w-full h-full flex flex-col justify-center mt-16 mb-20">
          <div className="flex justify-center">
            <div className="w-3/4 sm:w-1/2 md:w-1/3 text-center mb-8">
              <h2 className="text-3xl mb-4">Most Selling Courses</h2>
              <span>Best selling courses</span>
            </div>
          </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 lg:gap-x-12 gap-y-20 mb-10 app-x-padding">
              {items.map((item) => (
                <Card key={item.id} item={item as any} />
              ))}
            </div>
          )}
        </section>

        <div className="flex justify-center mb-10 flex-col lg:px-16">
          <div className="flex justify-center">
            <div className="w-3/4 sm:w-1/2 md:w-1/3 text-center mb-8">
              <h2 className="text-3xl mb-4">Blog Post</h2>
              <span>Latest</span>
            </div>
          </div>
          <div className="w-full">
            {blogLoading ? (
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
                <div className="flex justify-end mb-8 bg-white"></div>
                <div
                  className={`grid grid-cols-1 ${
                    gridView === 2 ? "md:grid-cols-2" : ""
                  } ${
                    gridView === 3 ? "md:grid-cols-2 lg:grid-cols-3" : ""
                  } gap-6`}
                >
                  {blogs.map((item) => (
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
          </div>
        </div>

        {/* ===== Testimonial Section ===== */}
        {/* <section className="w-full hidden h-full py-16 md:flex flex-col items-center bg-lightgreen">
          <h2 className="text-3xl">testimonial</h2>
          <TestiSlider />
        </section> */}

        {/* ===== blog Section ===== */}

        {/* ===== Featured Products Section ===== */}
        {/* <section className="app-max-width app-x-padding my-16 flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-3xl">{t("featured_products")}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
            {currentItems.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              value={!isFetching ? t("see_more") : t("loading")}
              onClick={handleSeemore}
            />
          </div>
        </section> */}

        <div className="border-gray100 border-b-2"></div>
      </main>

      {/* fotter goes here */}

      {/* ===== Footer Section ===== */}
      <Footer />
    </>
  );
};

export default Home;
