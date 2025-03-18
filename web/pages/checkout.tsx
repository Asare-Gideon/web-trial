import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import Image from "next/image";
import { GetStaticProps } from "next";
import ReactLoading from "react-loading";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Button from "../components/Buttons/Button";
import { roundDecimal } from "../components/Util/utilFunc";
import { useCart } from "../context/cart/CartProvider";
import Input from "../components/Input/Input";
import { itemType } from "../context/wishlist/wishlist-type";
import { useAuth } from "../context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebase/config";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import useAsyncCaller from "../hooks/useAsyncCaller";
import Item from "../components/CartItem/Item";
import PaymentSuccess from "../components/payment/SuccessfulPayment";

// let w = window.innerWidth;
type PaymentType = "CASH_ON_DELIVERY" | "BANK_TRANSFER";
type DeliveryType = "STORE_PICKUP" | "YANGON" | "OTHERS";

type Order = {
  orderNumber: number;
  customerId: number;
  shippingAddress: string;
  township?: null | string;
  city?: null | string;
  state?: null | string;
  zipCode?: null | string;
  orderDate: string;
  paymentType: PaymentType;
  deliveryType: DeliveryType;
  totalPrice: number;
  deliveryDate: string;
};

const ShoppingCart = () => {
  const { cart, clearCart } = useCart();
  const auth = useAuth();
  const [deli, setDeli] = useState<DeliveryType>("STORE_PICKUP");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentType>("CASH_ON_DELIVERY");

  // Form Fields
  const [name, setName] = useState(auth.user?.fullname || "");
  const [email, setEmail] = useState(auth.user?.email || "");
  const [phone, setPhone] = useState(auth.user?.phone || "");
  const [postOffice, setPostOffice] = useState("");
  const [diffAddr, setDiffAddr] = useState(false);
  const [address, setAddress] = useState(auth.user?.shippingAddress || "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [user, loading, error] = useAuthState(FIREBASE_AUTH);
  const router = useRouter();
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { handler: handleAddProductCaller, loading: isAdding } =
    useAsyncCaller();
  const [sendingData, setSendingData] = useState(false);

  // console.log(cart);
  const products = cart.map((item) => ({
    id: item.id,
    quantity: item.qty,
  }));

  async function updateCoursePurchases(): Promise<void> {
    try {
      const coursesRef = collection(FIREBASE_DB, "courses");

      for (const cartItem of cart) {
        const courseDocRef = doc(coursesRef, cartItem.id);
        const courseSnap = await getDoc(courseDocRef);

        if (courseSnap.exists()) {
          await updateDoc(courseDocRef, {
            purchaseUsers: arrayUnion(email),
          });
        } else {
          console.warn(`Course with ID ${cartItem.id} not found.`);
        }
      }
      if (clearCart) {
        clearCart();
      }
      localStorage.clear();
      console.log("Purchase users updated successfully");
    } catch (error) {
      console.error("Error updating course purchases:", error);
    }
  }

  const handleAddOrder = async () => {
    if (localStorage.getItem("orderItem") === undefined) return;
    setPaymentLoading(true);
    setSendingData(true);
    let orderItm = JSON.parse(localStorage.getItem("orderItem") as any);
    handleAddProductCaller(async () => {
      await addDoc(collection(FIREBASE_DB, "courses_purchased"), {
        date: serverTimestamp(),
        courses: orderItm.products,
        orderTotalPrice: orderItm.orderTotalPrice,
        user: {
          name: orderItm.user.name,
          email: orderItm.user.name,
        },
      });
    });
    updateCoursePurchases();
    setPaymentDone(true);
    setSendingData(false);
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      handleAddOrder();
    }
    if (query.get("canceled")) {
    }
  }, [isAdding]);

  const getUersInfo = async (email: string) => {
    let res = await getDoc(doc(FIREBASE_DB, "users", email));
    if (res) {
      setName(res.data()?.name);
      setEmail(res.data()?.email);
    }
  };

  useEffect(() => {
    if (user) {
      getUersInfo(user.email as any);
    }
  }, [user]);

  let disableOrder = false;

  // if (!auth.user) {
  //   disableOrder =
  //     name !== "" &&
  //     email !== "" &&
  //     phone !== "" &&
  //     address !== "" &&
  //     postOffice !== ""
  //       ? false
  //       : true;
  // } else {
  //   disableOrder =
  //     name !== "" && email !== "" && phone !== "" && address !== ""
  //       ? false
  //       : true;
  // }

  let subtotal: number | string = 0;

  subtotal = roundDecimal(
    cart.reduce(
      (accumulator: number, currentItem: itemType) =>
        accumulator + currentItem.price * currentItem!.qty!,
      0
    )
  );

  let deliFee = 0;
  if (deli === "YANGON") {
    deliFee = 2.0;
  } else if (deli === "OTHERS") {
    deliFee = 7.0;
  }

  const handlePayment = async () => {
    try {
      localStorage.setItem(
        "orderItem",
        JSON.stringify({
          products: cart,
          orderTotalPrice: roundDecimal(+subtotal + deliFee),
          user: {
            name: name,
            email: email,
          },
        })
      );
      setPaymentLoading(true);
      const rawResponse = await fetch("/api/checkout_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: roundDecimal(+subtotal + deliFee) }),
      });
      const content = await rawResponse.json();
      if (content) {
        router.push(content.url);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`Shopping Cart - Routine 11`} transparent={true} />
      {sendingData ? (
        <>
          <div className="w-full h-screen flex items-center justify-center ">
            <ReactLoading
              type={"bars"}
              color={"#db9175"}
              height={"60px"}
              width={"60px"}
            />
          </div>
        </>
      ) : (
        <>
          {paymentDone ? (
            <>
              <PaymentSuccess />
            </>
          ) : (
            <main id="main-content">
              {/* ===== Heading & Continue Shopping */}
              <div className="app-max-width px-4 sm:px-8 md:px-20 w-full border-t-2 border-gray100">
                <h1 className="text-2xl sm:text-4xl text-center sm:text-left mt-6 mb-2 animatee__animated animate__bounce">
                  checkout
                </h1>
              </div>

              {/* ===== Form Section ===== */}
              {!completedOrder ? (
                <div className="app-max-width px-4 sm:px-8 md:px-20 mb-14 flex flex-col justify-center lg:flex-row">
                  {/* <div className="h-full w-full lg:w-7/12 mr-8">
                    {errorMsg !== "" && (
                      <span className="text-red text-sm font-semibold">
                        - errorMsg
                      </span>
                    )}
                    <div className="my-4">
                      <label htmlFor="name" className="text-lg">
                        Name
                      </label>
                      <Input
                        name="name"
                        type="text"
                        extraClass="w-full mt-1 mb-2"
                        border="border-2 border-gray400"
                        value={name}
                        onChange={(e) =>
                          setName((e.target as HTMLInputElement).value)
                        }
                        required
                      />
                    </div>

                    <div className="my-4">
                      <label htmlFor="email" className="text-lg mb-1">
                        Email address
                      </label>
                      <Input
                        name="email"
                        type="email"
                        readOnly={auth.user ? true : false}
                        extraClass={`w-full mt-1 mb-2 ${
                          auth.user ? "bg-gray100 cursor-not-allowed" : ""
                        }`}
                        border="border-2 border-gray400"
                        value={email}
                        onChange={(e) =>
                          setEmail((e.target as HTMLInputElement).value)
                        }
                        required
                      />
                    </div>

                    <div className="my-4">
                      <label htmlFor="password" className="text-lg">
                        Post Office box
                      </label>
                      <Input
                        name="postOffice"
                        type="text"
                        extraClass="w-full mt-1 mb-2"
                        border="border-2 border-gray400"
                        value={postOffice}
                        onChange={(e) =>
                          setPostOffice((e.target as HTMLInputElement).value)
                        }
                        required
                      />
                    </div>

                    <div className="my-4">
                      <label htmlFor="phone" className="text-lg">
                        Phone
                      </label>
                      <Input
                        name="phone"
                        type="text"
                        extraClass="w-full mt-1 mb-2"
                        border="border-2 border-gray400"
                        value={phone}
                        onChange={(e) =>
                          setPhone((e.target as HTMLInputElement).value)
                        }
                        required
                      />
                    </div>

                    <div className="my-4">
                      <label htmlFor="address" className="text-lg">
                        Address
                      </label>
                      <textarea
                        aria-label="Address"
                        className="w-full mt-1 mb-2 border-2 border-gray400 p-4 outline-none"
                        rows={4}
                        value={address}
                        onChange={(e) =>
                          setAddress((e.target as HTMLTextAreaElement).value)
                        }
                      />
                    </div>

                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input
                        type="checkbox"
                        name="toggle"
                        id="toggle"
                        checked={diffAddr}
                        onChange={() => setDiffAddr(!diffAddr)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray300 appearance-none cursor-pointer"
                      />
                      <label
                        htmlFor="toggle"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray300 cursor-pointer"
                      ></label>
                    </div>
                    <label htmlFor="toggle" className="text-xs text-gray-700">
                      Different shipping address
                    </label>

                    {diffAddr && (
                      <div className="my-4">
                        <label htmlFor="shipping_address" className="text-lg">
                          Shipping address
                        </label>
                        <textarea
                          id="shipping_address"
                          aria-label="shipping address"
                          className="w-full mt-1 mb-2 border-2 border-gray400 p-4 outline-none"
                          rows={4}
                          value={shippingAddress}
                          onChange={(e) =>
                            setShippingAddress(
                              (e.target as HTMLTextAreaElement).value
                            )
                          }
                        />
                      </div>
                    )}

                    {!auth.user && (
                      <div className="text-sm text-gray400 mt-8 leading-6">
                        Form_note
                      </div>
                    )}
                  </div> */}
                  <div className="h-full w-full lg:w-5/12 mt-10 lg:mt-4">
                    {/* Cart Totals */}
                    <div className="border border-gray500 p-6 divide-y-2 divide-gray200">
                      <div className="flex justify-between">
                        <span className="text-base uppercase mb-3">Course</span>
                        <span className="text-base uppercase mb-3">
                          Subtotal
                        </span>
                      </div>

                      <div className="pt-2">
                        {cart.map((item) => (
                          <div
                            className="flex justify-between mb-2"
                            key={item.id}
                          >
                            <span className="text-base font-medium">
                              {item.name}{" "}
                              <span className="text-gray400">x {item.qty}</span>
                            </span>
                            <span className="text-base">
                              $ {roundDecimal(item.price * item!.qty!)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="py-3 flex justify-between">
                        <span className="uppercase">Subtotal</span>
                        <span>$ {subtotal}</span>
                      </div>

                      {/* <div className="py-3">
                        <span className="uppercase">Delivery</span>
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between">
                            <div>
                              <input
                                type="radio"
                                name="deli"
                                value="STORE_PICKUP"
                                id="pickup"
                                checked={deli === "STORE_PICKUP"}
                                onChange={() => setDeli("STORE_PICKUP")}
                              />{" "}
                              <label
                                htmlFor="pickup"
                                className="cursor-pointer"
                              >
                                Store pickup
                              </label>
                            </div>
                            <span>Free</span>
                          </div>
                          <div className="flex justify-between">
                            <div>
                              <input
                                type="radio"
                                name="deli"
                                value="YANGON"
                                id="ygn"
                                checked={deli === "YANGON"}
                                onChange={() => setDeli("YANGON")}
                                // defaultChecked
                              />{" "}
                              <label htmlFor="ygn" className="cursor-pointer">
                                Within yangon
                              </label>
                            </div>
                            <span>$ 2.00</span>
                          </div>
                          <div className="flex justify-between">
                            <div>
                              <input
                                type="radio"
                                name="deli"
                                value="OTHERS"
                                id="others"
                                checked={deli === "OTHERS"}
                                onChange={() => setDeli("OTHERS")}
                              />{" "}
                              <label
                                htmlFor="others"
                                className="cursor-pointer"
                              >
                                Other_cities
                              </label>
                            </div>
                            <span>$ 7.00</span>
                          </div>
                        </div>
                      </div> */}

                      <div>
                        <div className="flex justify-between py-3">
                          <span>grand_total</span>
                          <span>$ {roundDecimal(+subtotal + deliFee)}</span>
                        </div>

                        <div className="grid gap-4 mt-2 mb-4"></div>

                        <div className="my-8">
                          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                              type="checkbox"
                              name="send-email-toggle"
                              id="send-email-toggle"
                              checked={sendEmail}
                              onChange={() => setSendEmail(!sendEmail)}
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray300 appearance-none cursor-pointer"
                            />
                            <label
                              htmlFor="send-email-toggle"
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray300 cursor-pointer"
                            ></label>
                          </div>
                          <label
                            htmlFor="send-email-toggle"
                            className="text-xs text-gray-700"
                          >
                            send_order_email
                          </label>
                        </div>
                      </div>

                      <Button
                        value={"Purchase Courses"}
                        size="xl"
                        extraClass={`w-full`}
                        onClick={handlePayment}
                        disabled={disableOrder}
                        loading={paymentLoading}
                      />
                    </div>

                    {orderError !== "" && (
                      <span className="text-red text-sm font-semibold">
                        - {orderError}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="app-max-width px-4 sm:px-8 md:px-20 mb-14 mt-6">
                  <div className="text-gray400 text-base">Thank you note</div>

                  <div className="flex flex-col md:flex-row">
                    <div className="h-full w-full md:w-1/2 mt-2 lg:mt-4">
                      <div className="border border-gray500 p-6 divide-y-2 divide-gray200">
                        <div className="flex justify-between">
                          <span className="text-base uppercase mb-3">
                            Order_id
                          </span>
                          <span className="text-base uppercase mb-3">
                            {completedOrder.orderNumber}
                          </span>
                        </div>

                        <div className="pt-2">
                          <div className="flex justify-between mb-2">
                            <span className="text-base">Email_address</span>
                            <span className="text-base">
                              {auth.user?.email}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-base">Order_date</span>
                            <span className="text-base">
                              {new Date(
                                completedOrder.orderDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-base">delivery_date</span>
                            <span className="text-base">
                              {new Date(
                                completedOrder.deliveryDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="py-3">
                          <div className="flex justify-between mb-2">
                            <span className="">Payment method</span>
                            <span>{completedOrder.paymentType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="">Delivery method</span>
                            <span>{completedOrder.deliveryType}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-between mb-2">
                          <span className="text-base uppercase">total</span>
                          <span className="text-base">
                            $ {completedOrder.totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          )}
        </>
      )}
      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export default ShoppingCart;
