"use client";
import React, { useEffect, useState } from "react";
import CustomTable, {
  DEFAULT_TABLE_ACTIONS,
  DEFAULT_TABLE_ACTIONS_ENUM,
  SortStateEnum,
} from "../ui/custom-table";
import {
  MdCancel,
  MdDeleteOutline,
  MdOutlineEdit,
  MdOutlineRemoveRedEye,
  MdOutlineUploadFile,
} from "react-icons/md";
import { PiFolderOpenThin } from "react-icons/pi";
import { Badge } from "../ui/badge";
import { IoIosCheckmarkCircle, IoMdAddCircleOutline } from "react-icons/io";
import useListFilters from "@/features/ui/useListFilters";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { FIREBASE_DB } from "@/firebase/config";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ProductType } from "@/common/types/docs.types";
import { formatAmount, formatQty } from "@/common/utils/misc.utils";
import usePagedCollectionQuery from "@/hooks/usePagedCollectionQuery";
import { useRouter } from "next/navigation";
import AlertComp from "../ui/alertComp";
import { IoEyeOffOutline } from "react-icons/io5";
import { nameShortner } from "@/common/utils/nameShortner";

const COLLECTION_NAME = "courses";
const ProductsTable = () => {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState("");
  const { filters, setFilters } = useListFilters();
  const [deletedId, setDeletedId] = useState("");
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [search, setSearch] = useState("");
  const {
    total,
    totalPages,
    loading,
    data: products,
  } = usePagedCollectionQuery(collection(FIREBASE_DB, COLLECTION_NAME), {
    page: filters.page,
    deletedId,
    search,
    searchKey: "courseData.title",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openShowVisibleDialog, setOpenShowVisibleDialog] = useState(false);
  const [currentPVisibility, setCurrentPVisibility] = useState<boolean>();

  const router = useRouter();

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCloseShowingDialog = () => {
    setOpenShowVisibleDialog(false);
  };

  return (
    <div>
      <CustomTable
        allCellClassName="h-[60px]"
        headerList={[
          {
            text: "Image",
          },
          {
            text: "Name",
            sortable: {
              asc: "firstname lastname",
              desc: "-firstname -lastname",
              curr: SortStateEnum.asc,
            },
          },
          // {
          //   text: "Description",
          // },
          {
            text: "Category",
            sortable: {
              asc: "category",
              desc: "-categroy",
              curr: SortStateEnum.asc,
            },
          },
          { text: "Price" },
          { text: "status" },
          { text: "Quantity", itemClassName: "text-right" },
          { text: "Actions", itemClassName: "border-l" },
        ]}
        rightElements={[
          <Link key={1} href={"/newproduct"}>
            <Button className="border-primary h-11" variant={"outline"}>
              <IoMdAddCircleOutline className="mr-2 text-xl" />
              Add new Prodcut
            </Button>
          </Link>,
        ]}
        rows={products
          .map((data) => data as ProductType & { id: string })
          .map((product) => ({
            id: product.id,
            actions: [
              {
                onAction(id) {
                  console.log(id);
                  router.push(`/products/details?id=${id}`);
                },
                title: "View",
                icon: <PiFolderOpenThin size={18} />,
              },
              // {
              //   onAction(id) {
              //     console.log(id);
              //     setUpdateOpen(true);
              //   },
              //   icon: <MdOutlineEdit size={18} />,
              //   title: "Edit",
              // },
              {
                onAction(id) {
                  setDeleteSelected(id);
                  setOpenDialog(true);
                },
                title: "Delete",
                icon: <MdDeleteOutline size={18} />,
              },
              {
                onAction(id) {
                  setCurrentPVisibility(product.visible);
                  setDeleteSelected(id);
                  setOpenShowVisibleDialog(true);
                },
                title: !product.visible ? "Show" : "Hide",
                icon: product.visible ? (
                  <IoEyeOffOutline size={18} className="" />
                ) : (
                  <MdOutlineRemoveRedEye size={18} className="text-green-800" />
                ),
              },
            ],
            list: [
              {
                data: (
                  <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#f8f2f0]  ">
                    <Image
                      src={product.courseData.thumbnails[0]}
                      width={60}
                      height={40}
                      className=""
                      alt="img"
                    />
                  </div>
                ),
              },
              { data: product.courseData.title },
              // { data: nameShortner(product.courseData.description) },
              { data: product.courseData.category },
              {
                data: formatAmount(product.courseData.price),
              },
              {
                data: (
                  <Badge
                    variant={"outline"}
                    className="flex items-center space-x-1 h-[30px] max-w-[140px] whitespace-nowrap"
                  >
                    {product.visible ? (
                      <>
                        {/* <IoIosCheckmarkCircle
                        size={18}
                        className="text-green-800"
                      /> */}
                        <span className="ml-1 text-green-600">Visible</span>
                      </>
                    ) : (
                      <>
                        {/* <MdCancel size={18} className="text-red-800" /> */}
                        <span className="ml-1 text-red-400">Hidden</span>
                      </>
                    )}
                  </Badge>
                ),
              },
              {
                data: "null",
                itemClassName: "text-right",
              },
            ],
          }))}
        total={total}
        page={filters.page}
        setPage={(page) => {
          setFilters({ ...filters, page });
        }}
        totalPages={totalPages}
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
        open={openShowVisibleDialog}
        close={handleCloseShowingDialog}
        title="Set Course Visibility"
        message="Are you sure you want to update the visibility of this course?"
        id={deleteSelected}
        onOk={async () => {
          await updateDoc(doc(FIREBASE_DB, COLLECTION_NAME, deleteSelected), {
            visible: !currentPVisibility,
          });
          handleCloseShowingDialog();
        }}
      />
      <AlertComp
        open={openDialog}
        close={handleCloseDialog}
        title="Delete Course"
        message="Are you sure you want to delete this course?"
        loading={deletingProduct}
        id={deleteSelected}
        onOk={async () => {
          setDeletingProduct(true);
          await deleteDoc(doc(FIREBASE_DB, COLLECTION_NAME, deleteSelected));
          setDeletedId(deleteSelected);
          handleCloseDialog();
          setDeletingProduct(false);
        }}
      />
    </div>
  );
};

export default ProductsTable;
