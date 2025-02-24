import Link from "next/link";
import pay1 from "../../public/bg-img/payment-1.png";
import pay2 from "../../public/bg-img/payment-2.png";
import pay3 from "../../public/bg-img/payment-3.png";
import pay4 from "../../public/bg-img/payment-4.png";
import pay5 from "../../public/bg-img/payment-5.png";
import pay6 from "../../public/bg-img/payment-6.png";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="p-4 bg-black md:p-8 lg:p-10 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl text-center">
        <a
          href="#"
          className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <span>QueryEd</span>
        </a>

        <p className="my-6 text-gray-500 dark:text-gray-400">
          Learn with us and be future ready.
        </p>
        <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
          <li>
            <a href="/about" className="mr-4 hover:underline md:mr-6 ">
              About
            </a>
          </li>
          <li>
            <Link href="/blog" className="mr-4 hover:underline md:mr-6">
              Blog
            </Link>
          </li>
         
        </ul>
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2021-2022{" "}
          <a href="#" className="hover:underline">
            QueryEd
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
