"use client";
import React, { useState } from "react";
import CustomTable, {
  DEFAULT_TABLE_ACTIONS,
  DEFAULT_TABLE_ACTIONS_ENUM,
  SortStateEnum,
} from "../ui/custom-table";
import {
  MdCancel,
  MdDeleteOutline,
  MdOutlineEdit,
  MdOutlinePendingActions,
  MdOutlineUploadFile,
} from "react-icons/md";
import { PiFolderOpenThin } from "react-icons/pi";
import { Badge } from "../ui/badge";
import { IoIosCheckmarkCircle, IoMdAddCircleOutline } from "react-icons/io";
import useListFilters from "@/features/ui/useListFilters";
import Image from "next/image";
import { Button } from "../ui/button";
import { Router } from "next/router";
import Link from "next/link";
import usePagedCollectionQuery from "@/hooks/usePagedCollectionQuery";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebase/config";
import { orderType } from "@/common/types/docs.types";
import AlertComp from "../ui/alertComp";
import { useRouter } from "next/navigation";
import { nameShortner } from "@/common/utils/nameShortner";
const productImg = require("../../public/images/bg-img/img-product-12.png");

const COLLECTION_NAME = "orders";

const OrdersTable = () => {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState("");
  const { filters, setFilters } = useListFilters();
  const [deletedId, setDeletedId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(false);
  const [search, setSearch] = useState("");
  const {
    total,
    totalPages,
    loading,
    data: orders,
  } = usePagedCollectionQuery(collection(FIREBASE_DB, COLLECTION_NAME), {
    page: filters.page,
    deletedId,
    search,
    searchKey: "productData.name",
  });

  const router = useRouter();
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function getSum(total: any, num: any) {
    return total.qty + Math.round(num);
  }

  return (
    <div>
      <CustomTable
        // hideSearch
        allCellClassName="h-[60px]"
        headerList={[
          {
            text: "Image",
          },
          {
            text: "Name",
          },
          {
            text: "Total Products",
            itemClassName: "text-center",
          },
          {
            text: "Total quantity",
            itemClassName: "text-center",
          },
          {
            text: "Total Price",
            itemClassName: "text-center",
          },

          { text: "Status", itemClassName: "text-center" },
          {
            text: "Date",

            itemClassName: "text-center",
          },
          { text: "Actions", itemClassName: "border-l" },
        ]}
        rows={orders
          .map((data) => data as orderType & { id: string })
          .map((order) => ({
            id: order.id,
            actions: [
              {
                onAction(id) {
                  router.push(`/orders/details?id=${id}`);
                },
                title: "View",
                icon: <PiFolderOpenThin size={18} />,
              },
              {
                onAction(id) {
                  setDeleteSelected(id);
                  setOpenDialog(true);
                },
                title: "Delete",
                icon: <MdDeleteOutline size={18} />,
              },
            ],
            list: [
              {
                data: (
                  <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#f8f2f0] rounded-full">
                    <Image
                      src={order.products[0].img1}
                      width={40}
                      height={40}
                      className="rounded-full"
                      alt="img"
                    />
                  </div>
                ),
              },
              { data: order.products[0].name },
              {
                data: order.products.length,

                itemClassName: "text-center",
              },
              {
                data: order.products.reduce((p, c) => p + c.qty, 0),
                itemClassName: "text-center",
              },
              {
                data: order.orderTotalPrice,

                itemClassName: "text-center",
              },

              {
                data: (
                  <Badge
                    variant={"outline"}
                    className="flex items-center justify-center space-x-1 h-[30px] max-w-[140px] whitespace-nowrap"
                  >
                    {order.delivered ? (
                      <>
                        <IoIosCheckmarkCircle
                          size={18}
                          className="text-green-800"
                        />
                        <span className="ml-1 text-green-600">Delivered</span>
                      </>
                    ) : (
                      <>
                        <MdOutlinePendingActions
                          size={18}
                          className="text-yellow-600"
                        />
                        <span className="ml-1 text-yellow-600 text-center">
                          Pending
                        </span>
                      </>
                    )}
                  </Badge>
                ),
                itemClassName: "text-center",
              },
              {
                data: order.date.toDate().toDateString() as any,

                itemClassName: "text-center",
              },
            ],
          }))}
        total={total}
        page={filters.page}
        setPage={(page) => {
          setFilters({ ...filters, page });
        }}
        totalPages={1}
        sortBy={filters.sortBy}
        setSortBy={(sortBy) => {
          setFilters({ ...filters, sortBy });
        }}
        onSearchSubmit={(r) => {
          setSearch(r.search || "");
        }}
        actions={DEFAULT_TABLE_ACTIONS.map((action) => ({
          ...action,
          onAction(selectedList: string[]) {
            switch (action.key) {
              case DEFAULT_TABLE_ACTIONS_ENUM.delete:
                console.log("Delete!!", selectedList);
            }
          },
        }))}
      />
      <AlertComp
        message="Are sure you want to delete this order?"
        open={openDialog}
        loading={deletingOrder}
        close={handleCloseDialog}
        id={deleteSelected}
        onOk={async () => {
          setDeletingOrder(true);
          await deleteDoc(doc(FIREBASE_DB, COLLECTION_NAME, deleteSelected));
          setDeletedId(deleteSelected);
          handleCloseDialog();
          setDeletingOrder(false);
        }}
      />
    </div>
  );
};

export default OrdersTable;
