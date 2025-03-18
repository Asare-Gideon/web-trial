import Image from "next/image";
import Link from "next/link";

import AppHeader from "../Header/AppHeader";

const ComingSoon = () => {
  return (
    <>
      <AppHeader title="Coming Soon!" />
      <div className="flex flex-col h-screen justify-center items-center">
        <h1 className="text-3xl tracking-wider leading-10">coming soon</h1>
        <h2 className="text-2xl text-gray500 mt-2">page not created msg</h2>
        <Image
          src="/bg-img/coding.svg"
          alt="Not created yet"
          width={400}
          height={300}
        />
        <span className="text-gray400">
          go_back_to
          <Link href="/">
            <span className="underline ml-4 font-bold hover:text-gray500">
              home page
            </span>
          </Link>
          ?
        </span>
      </div>
    </>
  );
};

export default ComingSoon;
