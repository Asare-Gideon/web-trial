"use client";
import React from "react";
import { MdDashboard, MdOutlineContacts } from "react-icons/md";
import { LiaSitemapSolid } from "react-icons/lia";
import { TbBrandBlogger } from "react-icons/tb";
import Link from "next/link";
import { Router } from "next/router";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { IoClose } from "react-icons/io5";
import { BiCabinet } from "react-icons/bi";
import { FiPocket } from "react-icons/fi";

interface prop {
  open: boolean;
  close: () => void;
}

const Sidebar = ({ open, close }: prop) => {
  const pathename = usePathname();
  console.log(pathename);

  return (
    <>
      <aside
        id="separator-sidebar"
        className={`fixed top-0 left-0 z-40 w-full sm:w-72 h-screen transition-transform ${
          !open && "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white ">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/"
                className="flex items-center p-2 text-gray-900 rounded-lg    group"
              >
                <span className="flex-1 font-Koho-b font-[700] text-xl ms-3 whitespace-nowrap">
                  Store App
                </span>
              </Link>
            </li>
          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 ">
            <li>
              <Link
                onClick={close}
                href="/"
                className={`flex items-center ${
                  pathename == "/"
                    ? "text-white bg-primary"
                    : " hover:bg-gray-200"
                } p-2 py-3 text-gray-900 transition duration-75  rounded-lg    group`}
              >
                <MdDashboard
                  className={`flex-shrink-0 ${
                    pathename == "/" && "text-white"
                  } w-5 h-5 text-gray-500  transition duration-75`}
                />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={close}
                href="/products"
                className={`flex items-center ${
                  pathename == "/products" ||
                  pathename == "/product_details" ||
                  pathename == "/newproduct"
                    ? "text-white bg-primary"
                    : " hover:bg-gray-200"
                } p-2 py-3 text-gray-900 transition duration-75 rounded-lg   group`}
              >
                <LiaSitemapSolid
                  className={`flex-shrink-0 w-5 ${
                    (pathename == "/products" ||
                      pathename == "/product_details" ||
                      pathename == "/newproduct") &&
                    "text-white"
                  } h-5 text-gray-500 transition duration-75 `}
                />
                <span className="ms-3">Courses</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={close}
                href="/blog"
                className={`flex items-center ${
                  pathename == "/blog" || pathename == "/newblog"
                    ? "text-white bg-primary"
                    : "hover:bg-gray-200"
                } p-2 py-3 text-gray-900 transition duration-75 rounded-lg   group`}
              >
                <TbBrandBlogger
                  className={`flex-shrink-0 ${
                    pathename == "/blog" || pathename == "/newblog"
                      ? "text-white "
                      : ""
                  } w-5 h-5 text-gray-500 transition duration-75  `}
                />
                <span className="ms-3">Blogs</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={close}
                href="/orders"
                className={`flex items-center ${
                  pathename == "/orders"
                    ? "text-white bg-primary"
                    : "hover:bg-gray-200"
                } p-2 py-3 text-gray-900 transition duration-75 rounded-lg   group`}
              >
                <FiPocket
                  className={`flex-shrink-0 ${
                    pathename == "/orders" ? "text-white " : ""
                  } w-5 h-5 text-gray-500 transition duration-75  `}
                />
                <span className="ms-3">Orders</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={close}
                href="/made_in_uae"
                className={`flex items-center ${
                  pathename == "/made_in_uae"
                    ? "text-white bg-primary"
                    : "hover:bg-gray-200"
                } p-2 py-3 text-gray-900 transition duration-75 rounded-lg   group`}
              >
                <BiCabinet
                  className={`flex-shrink-0 ${
                    pathename == "/made_in_uae" ? "text-white " : ""
                  } w-5 h-5 text-gray-500 transition duration-75  `}
                />
                <span className="ms-3">Made in UAE</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={close}
                href="/contacts"
                className={`flex items-center ${
                  pathename == "/contacts"
                    ? "text-white bg-primary"
                    : "hover:bg-gray-200"
                } p-2 py-3 text-gray-900 transition duration-75 rounded-lg   group`}
              >
                <MdOutlineContacts
                  className={`flex-shrink-0 ${
                    pathename == "/contacts" ? "text-white " : ""
                  } w-5 h-5 text-gray-500 transition duration-75  `}
                />
                <span className="ms-3">Contacts</span>
              </Link>
            </li>
          </ul>
        </div>
        <Button
          onClick={close}
          variant={"outline"}
          className=" sm:hidden absolute top-5 right-4"
        >
          <IoClose className="text-xl" />
        </Button>
      </aside>
    </>
  );
};

export default Sidebar;
