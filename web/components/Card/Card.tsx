"use client";

import { type FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ShoppingCart, Check, Tag } from "lucide-react";

import Heart from "../../public/icons/Heart";
import HeartSolid from "../../public/icons/HeartSolid";
import type { itemType } from "../../context/cart/cart-types";
import { useCart } from "../../context/cart/CartProvider";
import { useWishlist } from "../../context/wishlist/WishlistProvider";
import type { ProductType } from "../../common/types";
import { useAuth } from "context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { FIREBASE_AUTH } from "../../firebase/config";

type Props = {
  item: ProductType;
};

const Card: FC<Props> = ({ item }) => {
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const { addOne } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWLHovered, setIsWLHovered] = useState(false);
  const auth = useAuth();
  const [user, loading, error] = useAuthState(FIREBASE_AUTH);
  const [isBought, setIsBought] = useState(false);

  // Check if the course is free
  const isFree = item.courseData.price === 0;

  const newItem: itemType = {
    id: item.id,
    name: item.courseData.title,
    price: item.courseData.price,
    category: item.courseData.category,
    date: item.date as any,
    description: item.courseData.description,
    img1: item.courseData.thumbnails[0],
  };

  const itemLink = `/products/${encodeURIComponent(item.id)}`;

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === item.id).length > 0;

  const handleWishlist = () => {
    alreadyWishlisted ? deleteWishlistItem!(newItem) : addToWishlist!(newItem);
  };

  useEffect(() => {
    if (item.purchaseUsers) {
      if (item.purchaseUsers.find((it) => it === user?.email)) {
        setIsBought(true);
      }
    }
  }, [item.purchaseUsers, user?.email]);

  return (
    <div className="group flex flex-col rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 mb-6">
      {/* Image container */}
      <div className="relative h-48 md:h-40 bg-[#f8f2f0] overflow-hidden">
        <Link href={itemLink}>
          <div
            className="w-full h-full relative cursor-pointer"
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={
                (item.courseData.thumbnails[0] as string) || "/placeholder.svg"
              }
              alt={item.courseData.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-transform duration-700 ${
                isHovered ? "scale-110" : "scale-100"
              } rounded-t-lg`}
            />

            {/* Overlay on hover */}
            <div
              className={`absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${
                isBought ? "pointer-events-none" : ""
              }`}
            >
              {!isBought && !isFree && (
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addOne!(newItem);
                    }}
                    className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md font-medium text-sm uppercase tracking-wide flex items-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    addToCart
                  </button>
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Status badges */}
        {isFree ? (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
            <Tag size={14} />
            Free
          </div>
        ) : isBought ? (
          <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
            <Check size={14} />
            Subscribed
          </div>
        ) : null}

        {/* Wishlist button */}
        <button
          type="button"
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-colors ${
            alreadyWishlisted
              ? "text-red-500"
              : "text-gray-600 hover:text-red-500"
          }`}
          aria-label={
            alreadyWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          onClick={handleWishlist}
          onMouseOver={() => setIsWLHovered(true)}
          onMouseLeave={() => setIsWLHovered(false)}
        >
          {isWLHovered || alreadyWishlisted ? <HeartSolid /> : <Heart />}
        </button>
      </div>

      {/* Content section */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={itemLink} className="group/title">
          <h3 className="font-medium text-gray-800 text-lg md:text-md line-clamp-2 group-hover/title:text-primary transition-colors mb-2">
            {item.courseData.title}
          </h3>
        </Link>

        <div className="mt-auto pt-2 flex items-center justify-between">
          {!isFree ? (
            <span className="text-lg font-semibold text-gray-900">
              ${item.courseData.price.toFixed(2)}
            </span>
          ) : (
            <span className="text-lg font-semibold text-green-600">Free</span>
          )}

          {!isBought && !isFree && (
            <button
              type="button"
              onClick={() => addOne!(newItem)}
              className="md:hidden border bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
            >
              <ShoppingCart size={14} />
              addToCart
            </button>
          )}

          {isBought && (
            <span className="text-sm text-green-600 font-medium md:hidden flex items-center gap-1">
              <Check size={14} />
              Enrolled
            </span>
          )}

          {isFree && !isBought && (
            <button
              type="button"
              onClick={(e) => {
                // Logic for enrolling in free course
              }}
              className="md:hidden border bg-green-100 hover:bg-green-200 text-green-600 px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
            >
              <Check size={14} />
              Enroll Free
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
