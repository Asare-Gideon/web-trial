import { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import Heart from "../../public/icons/Heart";
import styles from "./Card.module.css";
import HeartSolid from "../../public/icons/HeartSolid";
import { itemType } from "../../context/cart/cart-types";
import { useCart } from "../../context/cart/CartProvider";
import { useWishlist } from "../../context/wishlist/WishlistProvider";
import { ProductType } from "../../common/types";
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
  }, []);

  return (
    <div className={styles.card} style={{ marginBottom: 20 }}>
      <div
        style={{ backgroundColor: "#f8f2f0" }}
        className={"relative overflow-hidden mb-1 card-container "}
      >
        <Link href={itemLink}>
          <span
            tabIndex={-1}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {!isHovered && (
              <Image
                src={item.courseData.thumbnails[0] as string}
                alt={item.courseData.title}
                fill
                className="rounded-md"
                // layout="responsive"
              />
            )}
            {isHovered && (
              <Image
                className="transition-transform  rounded-md transform hover:scale-110 duration-1000"
                src={item.courseData.thumbnails[0] as string}
                alt={item.courseData.title}
                fill
              />
            )}
          </span>
        </Link>
        {isBought && (
          <h4 className=" px-5 py-1 text-sm rounded-md absolute top-2  left-2 bg-primary text-white">
            Subscribed
          </h4>
        )}
        <button
          type="button"
          className="absolute top-2 right-2 p-1 rounded-full"
          aria-label="Wishlist"
          onClick={handleWishlist}
          onMouseOver={() => setIsWLHovered(true)}
          onMouseLeave={() => setIsWLHovered(false)}
        >
          {isWLHovered || alreadyWishlisted ? <HeartSolid /> : <Heart />}
        </button>
        {!isBought && (
          <button
            type="button"
            onClick={() => {
              if (isBought) return;
              addOne!(newItem);
            }}
            className={styles.addBtn}
          >
            {isBought ? "Already bought" : "add_to_cart"}
          </button>
        )}
      </div>

      <div className="content">
        <Link href={itemLink}>
          <span className={styles.itemName}>{item.courseData.title}</span>
        </Link>
        <div className="text-gray400">$ {item.courseData.price}</div>
        {!isBought && (
          <button
            type="button"
            onClick={() => addOne!(newItem)}
            className="uppercase font-bold text-sm sm:hidden"
          >
            add_to_cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
