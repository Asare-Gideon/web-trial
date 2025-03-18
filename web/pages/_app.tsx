import { NextComponentType, NextPageContext } from "next";
import Router from "next/router";
import NProgress from "nprogress";

import { ProvideCart } from "../context/cart/CartProvider";
import { ProvideWishlist } from "../context/wishlist/WishlistProvider";
import { ProvideAuth } from "../context/AuthContext";

import "../styles/libs.min.css";
import "../styles/globals.css";
import "animate.css";
import "nprogress/nprogress.css";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/scrollbar/scrollbar.min.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

type AppCustomProps = {
  Component: NextComponentType<NextPageContext, any, {}>;
  cartState: string;
  wishlistState: string;
};

const MyApp = ({ Component }: AppCustomProps) => {
  return (
    // <ProvideAuth>
    <ProvideWishlist>
      <ProvideCart>
        <Component />
      </ProvideCart>
    </ProvideWishlist>
    // </ProvideAuth>
  );
};

export default MyApp;
