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
  MdOutlineRemoveRedEye,
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
import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "@/firebase/config";
import { blogType } from "@/common/types/docs.types";
import AlertComp from "../ui/alertComp";
import { useRouter } from "next/navigation";
import { IoEyeOffOutline } from "react-icons/io5";

const COLLECTION_NAME = "made_in_uae";

const UaeTable = () => {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState("");
  const { filters, setFilters } = useListFilters();
  const [openUploadExcel, setOpenUploadExcel] = useState(false);
  const [deletedId, setDeletedId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState(false);
  const [search, setSearch] = useState("");
  const {
    total,
    totalPages,
    loading,
    data: blogs,
  } = usePagedCollectionQuery(collection(FIREBASE_DB, COLLECTION_NAME), {
    page: filters.page,
    deletedId,
    search,
    searchKey: "blogData.title",
  });
  const router = useRouter();
  const [openShowVisibleDialog, setOpenShowVisibleDialog] = useState(false);
  const [currentPVisibility, setCurrentPVisibility] = useState<boolean>();
  const [blobPublishDate, setBlogPublishDate] = useState(null);

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
            text: "Title",
            sortable: {
              asc: "firstname lastname",
              desc: "-firstname -lastname",
              curr: SortStateEnum.asc,
            },
          },

          {
            text: "Type",
            sortable: {
              asc: "category",
              desc: "-categroy",
              curr: SortStateEnum.asc,
            },
          },
          { text: "Date posted" },
          { text: "status", itemClassName: "text-right" },
          { text: "Actions", itemClassName: "border-l" },
        ]}
        rightElements={[
          <Link key={1} href={"/made_in_uae/addnew"}>
            <Button className="border-primary h-11" variant={"outline"}>
              <IoMdAddCircleOutline className="mr-2 text-xl" />
              Add new uae
            </Button>
          </Link>,
        ]}
        rows={blogs
          .map((data) => data as blogType & { id: string })
          .map((blog) => ({
            id: blog.id,
            actions: [
              {
                onAction(id) {
                  router.push(`/made_in_uae/details?id=${id}`);
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
              {
                onAction(id) {
                  setCurrentPVisibility(blog.visible);
                  setDeleteSelected(id);
                  setOpenShowVisibleDialog(true);
                  setBlogPublishDate(blog.publishedAt);
                },
                title: blog.visible ? "Hide" : "Show",
                icon: blog.visible ? (
                  <IoEyeOffOutline size={18} className="" />
                ) : (
                  <MdOutlineRemoveRedEye size={18} className="text-green-800" />
                ),
              },
            ],
            list: [
              {
                data: (
                  <div className="w-[50px] h-[50px] relative overflow-hidden flex items-center justify-center bg-[#f8f2f0] rounded-full">
                    <Image
                      src={blog.blogData.images[0]}
                      width={50}
                      height={50}
                      className="rounded-full "
                      alt="img"
                    />
                  </div>
                ),
              },
              { data: blog.blogData.title },
              { data: blog.blogData.blogType[0] },
              { data: blog.date.toDate().toDateString() as any },
              {
                data: (
                  <Badge
                    variant={"outline"}
                    className="flex items-center justify-center space-x-1 h-[30px] max-w-[140px] whitespace-nowrap"
                  >
                    {blog.visible ? (
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
                        <span className="ml-1 text-red-400 text-center">
                          Hidden
                        </span>
                      </>
                    )}
                  </Badge>
                ),
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
        open={openShowVisibleDialog}
        close={handleCloseShowingDialog}
        title="Set UAE visibility"
        message="Are you sure you want to update the visibility of this UAE?"
        id={deleteSelected}
        onOk={async () => {
          if (blobPublishDate === null) {
            await updateDoc(doc(FIREBASE_DB, "made_in_uea", deleteSelected), {
              visible: !currentPVisibility,
              publishedAt: serverTimestamp(),
              manualUpdate: true,
            });
            handleCloseShowingDialog();
          } else {
            await updateDoc(doc(FIREBASE_DB, "made_in_uea", deleteSelected), {
              visible: !currentPVisibility,
              manualUpdate: true,
            });
            handleCloseShowingDialog();
          }
        }}
      />
      <AlertComp
        message="Are sure you want to delete this UAE?"
        loading={deletingBlog}
        open={openDialog}
        close={handleCloseDialog}
        id={deleteSelected}
        onOk={async () => {
          setDeletingBlog(true);
          await deleteDoc(doc(FIREBASE_DB, COLLECTION_NAME, deleteSelected));
          setDeletedId(deleteSelected);
          handleCloseDialog();
          setDeletingBlog(false);
        }}
      />
    </div>
  );
};

export default UaeTable;
