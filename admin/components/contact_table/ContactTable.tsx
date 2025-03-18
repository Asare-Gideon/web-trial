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
import ViewMoreComp from "../ui/ViewMoreComp";
import { truncate } from "@/common/utils/nameShortner";

const COLLECTION_NAME = "contacts";

const ContactTable = () => {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState("");
  const { filters, setFilters } = useListFilters();
  const [deletedId, setDeletedId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(false);
  const [search, setSearch] = useState("");
  const [openMore, setOpenMore] = useState(false);
  const [user, setUser] = useState<any>({ name: "", email: "", message: "" });
  const {
    total,
    totalPages,
    loading,
    data: orders,
  } = usePagedCollectionQuery(collection(FIREBASE_DB, COLLECTION_NAME), {
    page: filters.page,
    deletedId,
    search,
    searchKey: "name",
  });

  const handleCloseViewMore = () => {
    setOpenMore(false);
  };

  const router = useRouter();
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <CustomTable
        // hideSearch
        allCellClassName="h-[60px]"
        headerList={[
          {
            text: "User Name",
          },
          {
            text: "Email",
            itemClassName: "text-center",
          },
          {
            text: "Message",
            itemClassName: "text-center",
          },
          {
            text: "Date",

            itemClassName: "text-center",
          },
          { text: "Actions", itemClassName: "border-l" },
        ]}
        rows={orders
          .map((data) => data as any & { id: string })
          .map((order) => ({
            id: order.id,
            actions: [
              {
                onAction(id) {
                  setUser(order);
                  setOpenMore(true);
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
              { data: order.name },
              {
                data: order.email,

                itemClassName: "text-center",
              },
              {
                data: truncate(order.message),

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
        message="Are sure you want to delete this info?"
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
      <ViewMoreComp user={user} open={openMore} close={handleCloseViewMore} />
    </div>
  );
};

export default ContactTable;
