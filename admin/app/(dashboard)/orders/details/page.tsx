"use client";
import { blogType, orderType } from "@/common/types/docs.types";
import { ImageSlider } from "@/components/ui/ImageSlider";
import { FIREBASE_DB, SALES_REF } from "@/firebase/config";
import { DocumentData, addDoc, doc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import ReactLoading from "react-loading";
import { MdMyLocation } from "react-icons/md";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShowImageModal } from "@/components/ui/ShowImagesModal";
import useAsyncCaller from "@/hooks/useAsyncCaller";

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as any;
  const [orderData, setOrderData] = useState<orderType | undefined>();
  const [openImageModal, setOpenImageModal] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState("");
  const { handler: handleAddProductCaller, loading } = useAsyncCaller();

  const handleClosemodal = () => {
    setOpenImageModal(false);
  };

  const [value, orderLoading, error] = useDocument(
    doc(FIREBASE_DB, "orders", id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const handleUpdateOrder = async () => {
    handleAddProductCaller(async () => {
      const docRef = doc(FIREBASE_DB, "orders", id);
      await updateDoc(docRef, {
        delivered: true,
      });
    });
  };

  useEffect(() => {
    setOrderData(value?.data() as any);
  }, [value]);

  useEffect(() => {
    setImages([
      orderData?.products[0].img1,
      orderData?.products[0].img2,
    ] as any);
  }, [orderData]);

  const handleOpenModal = (img1: string, img2: string, title: string) => {
    setImages([img1, img2]);
    setModalTitle(title);
    setOpenImageModal(true);
  };

  return (
    <>
      {orderLoading ? (
        <div className="w-full  h-screen flex items-center justify-center ">
          <ReactLoading
            type={"spinningBubbles"}
            color={"#17AFFA"}
            height={"60px"}
            width={"60px"}
          />
        </div>
      ) : (
        <div className="w-full p-4 h-auto ">
          <div className="border-b-2 pb-4 flex items-center flex-wrap w-full justify-between">
            <div>
              <h2 className="text-xl md:text-3xl font-[700] mb-1">
                Order Details
              </h2>
              <div className="flex items-center">
                <h1 className="text-sm md:text-md font-normal">
                  <span className="text-gray-500 ">Order number</span>
                  <span className="ml-2">w3445454545</span>
                </h1>
                <h3 className="text-sm md:text-md font-normal ml-3">
                  {orderData?.date.toDate().toDateString()}
                </h3>
              </div>
            </div>
            <button
              onClick={handleUpdateOrder}
              disabled={orderData?.delivered}
              className={`${
                orderData?.delivered
                  ? "bg-gray-300 text-black cursor-not-allowed"
                  : "bg-primary text-white"
              }  py-3 px-10 rounded-md mr-3`}
            >
              {loading
                ? "loading.."
                : orderData?.delivered
                ? "Delivered"
                : " Set as delivered"}
            </button>
          </div>
          <section className="py-5 xl:py-10 relative">
            <div className="w-full xl:px-4 md:px-5 lg-6 mx-auto">
              <div className="flex items-start flex-col gap-6 xl:flex-row ">
                <div className="w-full max-w-sm md:max-w-3xl xl:max-w-sm flex items-start flex-col gap-8 max-xl:mx-auto">
                  <div className="p-6 border bg-white border-gray-200 rounded-3xl w-full group transition-all duration-500 hover:border-gray-400 ">
                    <h2 className="font-manrope font-bold text-2xl leading-10 text-black pb-6 border-b border-gray-200 ">
                      Order Summary
                    </h2>
                    <div className="data py-6 border-b border-gray-200">
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700">
                          Status
                        </p>
                        <p
                          className={`font-medium text-lg leading-8 text-gray-900 ${
                            orderData?.delivered
                              ? "bg-green-700/60"
                              : "bg-yellow-500/55"
                          } px-4`}
                        >
                          {orderData?.delivered ? "Delivered" : "Processing"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700">
                          Delivery Date
                        </p>
                        <p className="font-medium text-lg leading-8 text-gray-600">
                          {orderData?.deliveredOn
                            ? orderData.deliveredOn.toDate().toDateString()
                            : "null"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 mb-5">
                        <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700">
                          Total QTY
                        </p>
                        <p className="font-medium text-lg leading-8 text-gray-600">
                          {orderData?.products.reduce((p, c) => p + c.qty, 0)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4 ">
                        <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700 ">
                          payment Status
                        </p>
                        <p className="font-medium text-lg leading-8 text-emerald-500">
                          #Paid
                        </p>
                      </div>
                    </div>

                    <div className="total flex items-center justify-between pt-6">
                      <p className="font-normal text-xl leading-8 text-black ">
                        Total Price
                      </p>
                      <h5 className="font-manrope font-bold text-2xl leading-9 text-indigo-600">
                        ${orderData?.orderTotalPrice}
                      </h5>
                    </div>
                  </div>
                  <div className="p-6 border border-gray-200 bg-white rounded-3xl w-full group transition-all duration-500 hover:border-gray-400 ">
                    <h2 className="font-manrope font-bold text-2xl leading-10 text-black pb-6 border-b border-gray-200 ">
                      User Info
                    </h2>
                    <div className="data py-6 border-b border-gray-200">
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <p className="font-normal text-md leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700">
                          Name
                          <p className="font-medium text-md text-gray-900 ">
                            {orderData?.user.name}
                          </p>
                        </p>
                        <p className="font-medium text-md leading-8  text-gray-400 ">
                          Email
                          <p className="font-medium text-md text-gray-900 ">
                            {orderData?.user.email}
                          </p>
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700">
                          Post office
                          <p className="font-medium text-md text-gray-900 ">
                            {orderData?.user.postOffice}
                          </p>
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4 ">
                        <p className="font-normal text-lg leading-8 text-gray-400 transition-all duration-500 group-hover:text-gray-700 ">
                          Address
                          <p className="font-medium text-md text-gray-900 ">
                            {orderData?.user.address}
                          </p>
                        </p>
                      </div>
                    </div>
                    <div className="total flex items-center justify-between pt-6">
                      <p className="font-normal text-xl leading-8 text-black ">
                        Other Address
                      </p>
                      <p className="font-medium text-md text-gray-900 ">
                        {orderData?.user.anotherAddress}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-sm md:max-w-3xl max-xl:mx-auto">
                  <div className="grid grid-cols-1 gap-6">
                    {orderData?.products.map((p) => (
                      <div
                        onClick={() => handleOpenModal(p.img1, p.img2, p.name)}
                        key={p.id}
                        className="rounded-3xl p-6 bg-white border border-gray-100 cursor-pointer flex flex-col md:flex-row md:items-center gap-3 transition-all duration-500 hover:border-gray-400"
                      >
                        <div className="img-box bg-primary/60 rounded-md overflow-hidden ">
                          <Image
                            src={p.img1}
                            alt="Denim Jacket image"
                            className="w-full md:max-w-[122px] rounded-lg"
                            width={100}
                            height={100}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3 md:gap-8">
                          <div className="">
                            <h2 className="font-medium text-xl leading-8 text-black mb-3">
                              {p.name}
                            </h2>
                            <p className="font-normal text-lg leading-8 text-gray-500 ">
                              QTY: {p.qty}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-3"></div>
                            <h6 className="font-medium text-xl leading-8 text-indigo-600">
                              ${p.price}
                            </h6>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <ShowImageModal
            open={openImageModal}
            close={handleClosemodal}
            images={images}
            title={modalTitle}
          />
        </div>
      )}
    </>
  );
};

export default Page;
