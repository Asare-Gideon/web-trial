import Image from "next/image";

const img = require("../../public/bg-img/blog-banner.jpg");

const Banner = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary to-teal-400 text-white py-24 px-4">
      <Image
        src={img}
        alt="Banner Image"
        className="absolute inset-0 object-cover w-full h-full opacity-30"
        fill
      />
      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold animate-fadeInUp">
          Welcome to Our Modern Blog
        </h1>
        <p className="mt-6 text-lg animate-fadeInUp delay-2">
          Explore insightful articles on various topics.
        </p>
      </div>
    </div>
  );
};

export default Banner;
