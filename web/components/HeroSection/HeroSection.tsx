import React from "react";
import imageHero from "../../public/bg-img/home-hero.jpg";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="section-hero  relative section-home">
      <div className="section-hero__bg">
        <Image src={imageHero} fill alt="home-hero" />
      </div>
      <div
        className="section-hero__content"
        data-uk-scrollspy="target: > *; cls: uk-animation-slide-bottom-small; delay: 500"
      >
        <h1 className="section-hero__title">Where Theory Meets Practice</h1>
        <p className="section-hero__subtitle">Learn, Apply, Excel!</p>
      </div>
    </div>
  );
};

export default HeroSection;
