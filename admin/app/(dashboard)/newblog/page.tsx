"use client";
import {
  addNewBlogSchema,
  addNewProductSchema,
} from "@/common/utils/formSchemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TitleComp from "@/components/ui/title-comp";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const productImg = require("../.././../public/images/bg-img/blog.jpg");
import { RiDeleteBin5Line, RiDeleteBinLine } from "react-icons/ri";
import EditorCom from "./section/Editor";
import useAsyncCaller from "@/hooks/useAsyncCaller";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  BLOG_REF,
  FIREBASE_AUTH,
  FIREBASE_DB,
  FIREBASE_STORAGE,
} from "@/firebase/config";
import {
  getDownloadURL,
  uploadBytes,
  ref as ImageRef,
  UploadResult,
} from "firebase/storage";
import {
  DocumentData,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { convertToRaw } from "draft-js";
import { useCollection } from "react-firebase-hooks/firestore";
import { AddBlogType } from "@/components/ui/AddBlogType";
import AlertComp from "@/components/ui/alertComp";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

const Page = () => {
  const [editorState, setEditorState] = useState("");
  const [user] = useAuthState(FIREBASE_AUTH);
  const [openDialog, setOpenDialog] = useState(false);
  const form = useForm<z.infer<typeof addNewBlogSchema>>({
    resolver: zodResolver(addNewBlogSchema),
    defaultValues: {
      title: "",
      blogType: [],
    },
  });
  const [images, setImages] = useState([]);
  const { handler: handleAddProductCaller, loading } = useAsyncCaller();
  const [convertedMsg, setConvertedMsg] = useState();
  const [openBlogTypeModal, setOpenBlogTypeModal] = useState(false);
  const [blogTypeDeleting, setBlogTypeDeleting] = useState<boolean>(false);
  const [blogTypeId, setBlogTypeId] = useState<string>();
  const [publishDate, setPublishDate] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [blogtypData, setBlogtypData] = useState<
    { id: string; name: string }[] | undefined
  >();
  const [blogTypes, blogTypeLoading, blogTypError] = useCollection(
    collection(FIREBASE_DB, "blog_types"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseBlogtypeModal = () => {
    setOpenBlogTypeModal(false);
  };
  const handleRemoveImge = (img: any) => {
    let filteredImg = images.filter((i) => i != img);
    setImages(filteredImg);
  };

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let imageList = [...images, URL.createObjectURL(event.target.files[0])];
      setImages(imageList as any);
    }
  };

  const handleDeleteBlogType = async (id: string) => {
    setBlogTypeDeleting(true);
    await deleteDoc(doc(FIREBASE_DB, "blog_types", id));
    toast({
      variant: "default",
      title: "blog type deleted successfully",
    });
    handleCloseDialog();
    setBlogTypeDeleting(false);
  };

  useEffect(() => {
    if (blogTypes) {
      let newtyplist: DocumentData = [];
      blogTypes.docs.map((doc) => {
        newtyplist.push({ ...doc.data(), id: doc.id });
      });
      setBlogtypData(newtyplist as any);
    }
  }, [blogTypes]);

  // useEffect(() => {
  //   if (editorState) {
  //     setConvertedMsg(
  //       draftToHtml(convertToRaw((editorState as any).getCurrentContent()))
  //     );
  //   }
  // }, [editorState]);

  const handleSetEditorState = (e: any) => {
    setEditorState(e);
  };
  const cleanForm = () => {
    form.setValue("title", "");
    setEditorState("");
    setConvertedMsg(undefined);
    setImages([]);
    setScheduledDate("");
  };

  async function onSubmit(values: z.infer<typeof addNewBlogSchema>) {
    if (user && images.length > 0 && convertToRaw != undefined) {
      const imageUrls: string[] = [];
      try {
        await handleAddProductCaller(async () => {
          for (let i = 0; i < images.length; i++) {
            const response = await fetch(images[i]);
            const blob = await response.blob();
            const storageRef = ImageRef(
              FIREBASE_STORAGE,
              "images/" + new Date().getTime() + Math.round(Math.random() * 999)
            );
            const uploadTask: UploadResult = await uploadBytes(
              storageRef,
              blob
            );
            const imageUrl = await getDownloadURL(uploadTask.ref);
            imageUrls.push(imageUrl);
          }
          await addDoc(BLOG_REF, {
            adminEmail: user?.email,
            visible: false,
            scheduledDate: scheduledDate != "" ? scheduledDate : null,
            manualUpdate: scheduledDate != "" ? false : true,
            publishedAt:
              publishDate != ""
                ? Timestamp.fromDate(new Date(publishDate))
                : null,
            blogData: {
              title: values.title,
              blogType: values.blogType,
              message: editorState,
              images: imageUrls,
            },
            date: serverTimestamp(),
          });
        });
        toast({
          variant: "default",
          title: "blog added successfully",
        });
        cleanForm();
      } catch (err) {
        console.log(err);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Please add blog images and must be more than one",
      });
    }
  }

  return (
    <div className="p-4">
      <TitleComp title="Add New Blog" />
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className=" lg:flex gap-5">
              <div className=" lg:w-[50%]">
                <div className="mb-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blog Title</FormLabel>
                        <FormControl>
                          <Input
                            className="h-12"
                            placeholder="enter title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-2 flex items-center gap-4">
                  <div className="w-[80%]"></div>
                </div>
                <div>
                  <EditorCom
                    editorState={editorState}
                    setEditorState={handleSetEditorState}
                  />
                </div>
              </div>
              <div className="lg:w-[50%] flex flex-col ">
                <div>
                  <h3 className="text-md">Add Blog Cover Image</h3>
                  <div className="mt-4">
                    <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-3">
                      {images.map((img) => (
                        <div className=" w-[10rem] h-[14rem]  bg-[#f8f2f0] relative border-2 border-white rounded-md overflow-hidden hover:shadow-md cursor-pointer">
                          <Image
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                            fill
                          />
                          <Button
                            onClick={() => handleRemoveImge(img)}
                            variant={"ghost"}
                            type="button"
                            className="absolute z-20 right-1 top-1"
                          >
                            <RiDeleteBin5Line className="text-xl" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Input
                        type="file"
                        className="h-12 lg:w-[60%] cursor-pointer"
                        placeholder="enter..."
                        onChange={onImageChange}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="blogType"
                      render={() => (
                        <FormItem>
                          <div className="mb-4 mt-5 flex  justify-between md:w-[60%]">
                            <FormDescription className="text-md">
                              Select Blog types
                            </FormDescription>
                            <Button
                              onClick={() => setOpenBlogTypeModal(true)}
                              type="button"
                              variant={"outline"}
                              className="border-primary"
                            >
                              Add New Type
                            </Button>
                          </div>
                          <div className="bg-white p-2 rounded-md overflow-y-scroll md:w-[60%] max-h-[13rem] h-full">
                            {blogtypData?.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="blogType"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row hover:bg-gray-100 px-3 my-2 items-center justify-between space-x-3 space-y-0"
                                    >
                                      <div>
                                        <FormControl>
                                          <Checkbox
                                            className="h-5 w-5 mr-3"
                                            checked={field.value?.includes(
                                              item.name
                                            )}
                                            onCheckedChange={(checked) => {
                                              console.log(field);
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item.name,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) =>
                                                        value !== item.name
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal text-md">
                                          {item.name}
                                        </FormLabel>
                                      </div>
                                      <Button
                                        onClick={() => {
                                          setBlogTypeId(item.id);
                                          setOpenDialog(true);
                                        }}
                                        type="button"
                                        variant={"ghost"}
                                      >
                                        <Trash2
                                          size={18}
                                          className="text-gray-500"
                                        />
                                      </Button>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col mt-5">
                      <label>Chose Publish date (Optional)</label>
                      <input
                        type="datetime-local"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                        className="w-[60%] py-3 px-2 rounded-lg mt-1 cursor-pointer"
                      />
                    </div>
                    {/* <div className="flex flex-col mt-5">
                      <label>
                        Schedule Date for automatic publication (optional):
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-[60%] py-3 px-2 rounded-lg mt-1 cursor-pointer"
                      />
                    </div> */}
                    <div className="w-full flex items-center mt-[2rem]">
                      <Button
                        loading={loading}
                        className="h-12 w-[80%] md:w-[60%]"
                        type="submit"
                      >
                        Submit Blog
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <AddBlogType open={openBlogTypeModal} close={handleCloseBlogtypeModal} />
      <AlertComp
        loading={blogTypeDeleting}
        message="Are sure you want to delete this type?"
        open={openDialog}
        close={handleCloseDialog}
        onOk={() => handleDeleteBlogType(blogTypeId as any)}
      />
    </div>
  );
};

export default Page;
