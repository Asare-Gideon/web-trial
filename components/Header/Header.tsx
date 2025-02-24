import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

import TopNav from "./TopNav";
import WhistlistIcon from "../../public/icons/WhistlistIcon";
import UserIcon from "../../public/icons/UserIcon";
import CartItem from "../CartItem/CartItem";
import Menu from "../Menu/Menu";
import AppHeader from "./AppHeader";
import { useWishlist } from "../../context/wishlist/WishlistProvider";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";

import styles from "./Header.module.css";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  title?: string;
  transparent?: boolean;
};

const Header: React.FC<Props> = ({ title, transparent }) => {
  const s = transparent || false;
  const { wishlist } = useWishlist();
  const [animate, setAnimate] = useState("");
  const [scrolled, setScrolled] = useState<boolean>(s);
  const [didMount, setDidMount] = useState<boolean>(false); // to disable Can't perform a React state Warningconst route = Router()
  const [user, loading, error] = useAuthState(FIREBASE_AUTH);
  const [signOut, SignoutLoading, SignuotError] = useSignOut(FIREBASE_AUTH);
  const [userinfo, setUserInfo] = useState<any | undefined>();

  // Calculate Number of Wishlist
  let noOfWishlist = wishlist.length;

  const handleSignOut = async () => {
    const success = await signOut();
  };

  // Animate Wishlist Number
  const handleAnimate = useCallback(() => {
    if (noOfWishlist === 0) return;
    setAnimate("animate__animated animate__headShake");
  }, [noOfWishlist, setAnimate]);

  // Set animate when no of wishlist changes
  useEffect(() => {
    handleAnimate();
    setTimeout(() => {
      setAnimate("");
    }, 1000);
  }, [handleAnimate]);

  const getUersInfo = async (email: string) => {
    let res = await getDoc(doc(FIREBASE_DB, "users", email));
    if (res) {
      setUserInfo(res.data());
    }
  };

  useEffect(() => {
    if (user) {
      getUersInfo(user.email as any);
    }
  }, [user, loading]);

  const handleScroll = useCallback(() => {
    const offset = window.scrollY;
    if (offset > 30) {
      if (!transparent) {
        setScrolled(true);
      }
    } else {
      if (!transparent) {
        setScrolled(false);
      }
    }
  }, [setScrolled]);

  useEffect(() => {
    setDidMount(true);
    window.addEventListener("scroll", handleScroll);
    return () => setDidMount(false);
  }, [handleScroll]);

  if (!didMount) {
    return null;
  }
  return (
    <>
      {/* ===== <head> section ===== */}
      <AppHeader title={title} />

      {/* ===== Skip to main content button ===== */}
      {/* <a
        href="#main-content"
        className="whitespace-nowrap absolute z-50 left-4 opacity-90 rounded-md bg-white px-4 py-3 transform -translate-y-40 focus:translate-y-0 transition-all duration-300"
      >
        {t("skip_to_main_content")}
      </a> */}

      {/* ===== Top Navigation ===== */}
      {/* <TopNav /> */}

      {/* ===== Main Navigation ===== */}
      <nav
        className={`${
          scrolled
            ? "bg-white sticky top-0 text-black shadow-md z-50"
            : "lg:bg-transparent lg:text-white shadow-sm"
        } w-full z-50 h-20 relative `}
      >
        <div className="app-max-width w-full">
          <div
            className={`flex justify-between align-baseline app-x-padding ${styles.mainMenu}`}
          >
            {/* Hamburger Menu and Mobile Nav */}
            <div className="flex-1 lg:flex-0 lg:hidden">
              <Menu scrolled={scrolled} />
            </div>
            {/* Left Nav */}
            <ul className={`flex-0 lg:flex-1 flex ${styles.leftMenu}`}>
              
              <li className=" hover:text-primary">
                <Link href="/about">
                  <span>About</span>
                </Link>
              </li>
              <li className=" hover:text-primary">
                <Link href="/blog">
                  <span>Blog</span>
                </Link>
              </li>
              {/* <li className="group hover-show">
                <li className=" hover:text-primary">
                  <Link href={`/madeinuae`} className=" relative ">
                    <span>Made In UK</span>
                    <div className="absolute -right-10 top-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </div>
                  </Link>
                </li>
                <div className="absolute z-40  sub-show">
                  <div className="w-48  h-20 -ml-8 mt-3 flex-col flex items-center justify-center relative  bg-white">
                    <div className=" hover:text-primary  flex justify-center">
                      <Link className="text-black" href={`/beautyaward`}>
                        <span>Beauty Award</span>
                      </Link>
                    </div>
                    <div
                      style={{ height: 0.5, marginTop: 4, marginBottom: 4 }}
                      className="w-full bg-gray300"
                    ></div>
                    <div className=" hover:text-primary">
                      <Link className="text-black" href={`/madeinuae`}>
                        <span>Made In UK</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </li> */}
            </ul>

            {/* Kmtec Logo */}
            <div className="flex-1 flex justify-center items-center cursor-pointer">
              <div className="w-32 h-auto">
                <Link href="/">
                  {/* <span>
                    <Image
                      className="justify-center"
                      src="/logo.svg"
                      alt="Picture of the author"
                      width={220}
                      height={50}
                      layout="responsive"
                    />
                  </span> */}
                  <h1
                    className={`text-2xl  cursor-pointer text-white font-bold ${
                      scrolled && "text-black"
                    }`}
                  ></h1>
                </Link>
              </div>
            </div>

            {/* Right Nav */}
            <ul
              className={`flex-1 flex justify-end ${!scrolled && ""} ${
                styles.rightMenu
              }`}
            >
              <li className=" hover:text-primary relative acount-show">
                {user ? (
                  <>
                    <Link href={"#"}>
                      <UserIcon />
                    </Link>
                    <div className="p-3 accoun-popup absolute bg-gray100 -ml-20 z-30 w-52">
                      <div className="flex items-center text-md pb-4 border-b border-gray400">
                        <span className="text-black mr-1">
                          <UserIcon />
                        </span>
                        <h1 className="text-md">{userinfo?.name}</h1>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="bg-black text-white w-full mt py-1 mt-3"
                      >
                        {SignoutLoading ? "signing out...." : "Logout"}
                      </button>
                    </div>
                  </>
                ) : (
                  <Link href={"/login"}>
                    <UserIcon />
                  </Link>
                )}
              </li>
              <li className=" hover:text-primary">
                <Link href="/wishlist" passHref>
                  {/* <a className="relative" aria-label="Wishlist"> */}
                  <button
                    type="button"
                    className="relative"
                    aria-label="Wishlist"
                  >
                    <WhistlistIcon />
                    {noOfWishlist > 0 && (
                      <span
                        className={`${animate} absolute text-xs -top-3 -right-3 bg-gray500 text-gray100 py-1 px-2 rounded-full`}
                      >
                        {noOfWishlist}
                      </span>
                    )}
                  </button>
                  {/* </span> */}
                </Link>
              </li>
              <li>
                <CartItem scrolled={scrolled} />
              </li>
            </ul>
            <span className=" mr-4 lg:flex-0 lg:hidden">
              <CartItem scrolled={scrolled} />
            </span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
