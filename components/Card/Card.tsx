import { FC, useState } from "react";
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

type Props = {
  item: ProductType;
};

const Card: FC<Props> = ({ item }) => {
  console.log(item);
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const { addOne } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWLHovered, setIsWLHovered] = useState(false);
  const newItem: itemType = {
    id: item.id,
    name: item.productData.name,
    price: item.productData.price,
    category: item.productData.category,
    date: item.date,
    description: item.productData.description,
    img1: item.productData.images[0],
    img2: item.productData.images[1],
  };

  const itemLink = `/products/${encodeURIComponent(item.id)}`;

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === item.id).length > 0;

  const handleWishlist = () => {
    alreadyWishlisted ? deleteWishlistItem!(newItem) : addToWishlist!(newItem);
  };

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
                src={item.productData.images[0] as string}
                alt={item.productData.name}
                fill
                className="rounded-md"
                // layout="responsive"
              />
            )}
            {isHovered && (
              <Image
                className="transition-transform  rounded-md transform hover:scale-110 duration-1000"
                src={item.productData.images[1] as string}
                alt={item.productData.name}
                fill
              />
            )}
          </span>
        </Link>
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
        <button
          type="button"
          onClick={() => addOne!(newItem)}
          className={styles.addBtn}
        >
          add_to_cart
        </button>
      </div>

      <div className="content">
        <Link href={itemLink}>
          <span className={styles.itemName}>{item.productData.name}</span>
        </Link>
        <div className="text-gray400">$ {item.productData.price}</div>
        <button
          type="button"
          onClick={() => addOne!(newItem)}
          className="uppercase font-bold text-sm sm:hidden"
        >
          add_to_cart
        </button>
      </div>
    </div>
  );
};

export default Card;
