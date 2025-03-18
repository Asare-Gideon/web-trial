import React, { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { IoMenuSharp } from "react-icons/io5";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebase/config";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { collection, doc, query, where } from "firebase/firestore";

type userCredentialType = {
  fullName: string;
  email: string;
};

const Topbar = ({ openNav }: { openNav: () => void }) => {
  const [signOut, loading, error] = useSignOut(FIREBASE_AUTH);
  const [user] = useAuthState(FIREBASE_AUTH);
  const [userCredentials, setUserCredentials] = useState<userCredentialType>();

  const [value] = useCollectionOnce(
    query(collection(FIREBASE_DB, "admins"), where("email", "==", user?.email)),
    {}
  );

  useEffect(() => {
    if (value) {
      value.docs.map((doc) => {
        setUserCredentials(doc.data() as any);
      });
    }
  }, [value]);

  console.log(userCredentials);
  const handleSignOut = async () => {
    const success = await signOut();
  };

  return (
    <div className="fixed top-0 w-full h-[5rem] z-30 shadow-sm flex justify-center bg-white">
      <div className="container flex justify-between sm:justify-end h-full items-center">
        <Button onClick={openNav} variant={"outline"} className="sm:hidden">
          <IoMenuSharp className="text-xl" />
        </Button>
        <div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="outline">
                <MdAccountCircle className="text-xl" />
                <span className="mx-3">Admin</span>
                <FaChevronDown className="text-sm ml-5" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-72">
              <div className="">
                <h1 className="text-lg font-koho-B font-[700]">
                  {userCredentials?.fullName}
                </h1>
                <h3 className="text-sm font-koho-L">
                  {userCredentials?.email}
                </h3>
                <Button
                  onClick={handleSignOut}
                  className="w-full mt-5"
                  variant={"outline"}
                >
                  <span>{loading ? "loading.." : "Logout"}</span>
                </Button>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
