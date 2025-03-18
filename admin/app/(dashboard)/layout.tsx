"use client";
import Sidebar from "@/components/sidebar/Sidebar";
import Topbar from "@/components/topbar/Topbar";
import React, { useState } from "react";
import Page from "./login/page";
import { useAuthState } from "react-firebase-hooks/auth";
import { FIREBASE_AUTH } from "@/firebase/config";
import ReactLoading from "react-loading";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  const [openNav, setOpenNav] = useState(false);
  const [user, loading, error] = useAuthState(FIREBASE_AUTH);

  const handleOpenNav = () => {
    setOpenNav(true);
  };
  const handleCloseNav = () => {
    setOpenNav(false);
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center ">
          <ReactLoading
            type={"spinningBubbles"}
            color={"#17AFFA"}
            height={"60px"}
            width={"60px"}
          />
        </div>
      ) : (
        <>
          {user ? (
            <div className=" bg-gray-200/55 w-full h-auto lg:min-h-[120vh] lg:h-full">
              <Topbar openNav={handleOpenNav} />
              <div className="flex">
                <Sidebar close={handleCloseNav} open={openNav} />
                <div className="sm:ml-72 mt-[5rem] w-full  sm:w-[calc(100%_-_18rem)] ">
                  {children}
                </div>
              </div>
            </div>
          ) : (
            <Page />
          )}
        </>
      )}
    </>
  );
}
