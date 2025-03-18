import Image from "next/image";
import shop1 from "../../public/bg-img/cat-it.png";
import shop2 from "../../public/bg-img/cat-book.png";
import shop3 from "../../public/bg-img/cat-ai.png";
import shop4 from "../../public/bg-img/cat-web.png";
import shop5 from "../../public/bg-img/cat-robo.png";
import { useRouter } from "next/router";
import Link from "next/link";

const ShopCategories = () => {
  const router = useRouter();
  return (
    <div className="section-shop-categories">
      <div className="uk-section uk-container">
        <div className="section-content">
          <div
            className="uk-grid uk-child-width-1-5@m uk-child-width-1-2 uk-flex-center"
            data-uk-grid
            data-uk-scrollspy="target: > div; cls: uk-animation-slide-bottom-small; delay: 300"
          >
            <div>
              <div className="shop-categories-unit">
                <Link
                  className="shop-categories-unit__link"
                  href="/product-category/IT Courses"
                >
                  <span className="shop-categories-unit__icon">
                    <Image
                      height={100}
                      width={100}
                      src={shop1}
                      alt="shop-categories"
                      style={{
                        filter: "grayscale(50%)",
                      }}
                    />
                  </span>
                  <span className="shop-categories-unit__title">IT</span>
                </Link>
              </div>
            </div>
            <div>
              <div className="shop-categories-unit">
                <Link
                  className="shop-categories-unit__link"
                  href="/product-category/Books"
                >
                  <span className="shop-categories-unit__icon">
                    <Image
                      height={100}
                      width={100}
                      src={shop2}
                      alt="shop-categories"
                      style={{
                        filter: "grayscale(50%)",
                      }}
                    />
                  </span>
                  <span className="shop-categories-unit__title">Books</span>
                </Link>
              </div>
            </div>
            <div>
              <div className="shop-categories-unit">
                <Link
                  className="shop-categories-unit__link"
                  href="/product-category/AI"
                >
                  <span className="shop-categories-unit__icon">
                    <Image
                      height={100}
                      width={100}
                      src={shop3}
                      alt="shop-categories"
                      style={{
                        filter: "grayscale(50%)",
                      }}
                    />
                  </span>
                  <span className="shop-categories-unit__title">AI</span>
                </Link>
              </div>
            </div>
            <div>
              <div className="shop-categories-unit">
                <Link
                  className="shop-categories-unit__link"
                  href="/product-category/Web"
                >
                  <span className="shop-categories-unit__icon">
                    <Image
                      height={100}
                      width={100}
                      src={shop4}
                      style={{
                        filter: "grayscale(50%)",
                      }}
                      alt="shop-categories"
                    />
                  </span>
                  <span className="shop-categories-unit__title">Web</span>
                </Link>
              </div>
            </div>
            <div>
              <div className="shop-categories-unit">
                <Link
                  className="shop-categories-unit__link"
                  href="/product-category/Robotics"
                >
                  <span className="shop-categories-unit__icon">
                    <Image
                      height={100}
                      width={100}
                      src={shop5}
                      alt="shop-categories"
                      style={{
                        filter: "grayscale(50%)",
                      }}
                    />
                  </span>
                  <span className="shop-categories-unit__title">Robotics</span>
                </Link>
              </div>
            </div>
          </div>
          <div
            className="section-shop-categories__desc"
            data-uk-scrollspy="target: > div; cls: uk-animation-slide-bottom-small; delay: 300"
          >
            <div className="section-shop-categories__title">
              Discover the best illuminating Courses and Books
            </div>
            <div className="section-shop-categories__text">
              Unlock a world of knowledge and skills with our expertly curated
              courses and books. Whether you're looking to inspire creativity,
              gain new expertise, or empower your personal or professional
              growth, we've got the perfect resources for you
            </div>
            <div className="section-shop-categories__btn mx-auto w-fit">
              <Link
                className="bg-primary uppercase my-6 block w-fit hover:bg-black hover:text-white hover:no-underline transition-all duration-500 px-8 py-6 font-FaunaOne text-xl text-white"
                href="/product-category/All Products"
              >
                Start shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCategories;
