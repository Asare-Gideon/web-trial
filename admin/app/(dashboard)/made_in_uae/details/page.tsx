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
import ReactLoading from "react-loading";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RiDeleteBin5Line, RiDeleteBinLine } from "react-icons/ri";
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
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import {
  convertToRaw,
  EditorState,
  convertFromHTML,
  ContentState,
} from "draft-js";
// import {  } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import EditorCom from "../../newblog/section/Editor";
import { blogType } from "@/common/types/docs.types";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useSearchParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaRegEdit } from "react-icons/fa";
import { AddBlogType } from "@/components/ui/AddBlogType";
import AlertComp from "@/components/ui/alertComp";
import { Checkbox } from "@/components/ui/checkbox";

const Page = () => {
  const searchParams = useSearchParams();
  const [editorState, setEditorState] = useState("");
  const id = searchParams.get("id") as any;
  const [blogData, setBlogData] = useState<blogType | undefined>();
  const [editable, setEditable] = useState(false);
  const [blogTypeDeleting, setBlogTypeDeleting] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [value, blogLoading, error] = useDocument(
    doc(FIREBASE_DB, "made_in_uae", id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [user] = useAuthState(FIREBASE_AUTH);
  const form = useForm<z.infer<typeof addNewBlogSchema>>({
    resolver: zodResolver(addNewBlogSchema),
    defaultValues: {
      title: "",
      blogType: [],
    },
  });
  const [images, setImages] = useState([]);
  const { handler: handleAddProductCaller, loading } = useAsyncCaller();
  // const [convertedMsg, setConvertedMsg] = useState();
  const [blocks, setBlocks] = useState();
  const [blogTypeId, setBlogTypeId] = useState<string>();
  const [openBlogTypeModal, setOpenBlogTypeModal] = useState(false);
  const [blogtypData, setBlogtypData] = useState<
    { id: string; name: string }[] | undefined
  >();
  const [blogTypes, blogTypeLoading, blogTypError] = useCollection(
    collection(FIREBASE_DB, "uae_types"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const handleCloseBlogtypeModal = () => {
    setOpenBlogTypeModal(false);
  };

  const onImageChange = (event: any) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      let imageList = [...images, URL.createObjectURL(event.target.files[0])];
      setImages(imageList as any);
    }
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

  useEffect(() => {
    setBlogData(value?.data() as any);
  }, [value]);

  // useEffect(() => {
  //   if (editorState) {
  //     setConvertedMsg(
  //       draftToHtml(convertToRaw((editorState as any).getCurrentContent()))
  //     );
  //   }
  // }, [editorState]);

  useEffect(() => {
    form.setValue("title", blogData?.blogData.title as any);
    form.setValue("blogType", blogData?.blogData.blogType as any);
    if (blogData) {
      setEditorState(blogData?.blogData.message);
    }
  }, [blogData]);

  const customContentStateConverter = (contentState: any) => {
    const newBlockMap = contentState.getBlockMap().map((block: any) => {
      const entityKey = block.getEntityAt(0);
      if (entityKey !== null) {
        const entityBlock = contentState.getEntity(entityKey);
        const entityType = entityBlock.getType();
        switch (entityType) {
          case "IMAGE": {
            const newBlock = block.merge({
              type: "atomic",
              text: "img",
            });
            return newBlock;
          }
          default:
            return block;
        }
      }
      return block;
    });
    const newContentState = contentState.set("blockMap", newBlockMap);
    return newContentState;
  };

  // useEffect(() => {
  //   if (blocks) {
  //     console.log(blocks);
  //     setEditorState(
  //       EditorState.createWithContent(
  //         customContentStateConverter(
  //           ContentState.createFromBlockArray(
  //             (blocks as any).contentBlocks,
  //             (blocks as any).entityMap
  //           )
  //         )
  //       )
  //     );
  //   }
  // }, [blocks]);

  // console.log(ContentState);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteBlogType = async (id: string) => {
    setBlogTypeDeleting(true);
    await deleteDoc(doc(FIREBASE_DB, "uae_types", id));
    toast({
      variant: "default",
      title: "UAE type deleted successfully",
    });
    handleCloseDialog();
    setBlogTypeDeleting(false);
  };

  const handleSetEditorState = (e: any) => {
    setEditorState(e);
  };
  const handleRemoveImge = (img: any) => {
    let filteredImg = images.filter((i) => i != img);
    setImages(filteredImg);
  };

  const handleRemoveImg2 = (img: any) => {
    let filteredImga = blogData?.blogData.images.filter((i) => i != img);

    setBlogData({
      ...blogData,
      blogData: {
        ...blogData?.blogData,
        images: filteredImga,
      },
    } as any);
  };

  const cleanForm = () => {
    setImages([]);
  };

  async function onSubmit(values: z.infer<typeof addNewBlogSchema>) {
    const imageUrls: string[] = [];
    try {
      await handleAddProductCaller(async () => {
        if (images.length > 0) {
          for (let i = 0; i <= images.length; i++) {
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
        }
        const docRef = doc(FIREBASE_DB, "made_in_uae", id);
        await updateDoc(docRef, {
          blogData: {
            title: values.title,
            blogType: values.blogType,
            message: editorState,
            images:
              images.length > 0
                ? [...(blogData?.blogData.images as any), ...imageUrls]
                : [...(blogData?.blogData.images as any)],
          },
        });
        toast({
          variant: "default",
          title: "UAE updated successfully",
        });
        cleanForm();
      });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      {blogLoading ? (
        <div className="w-full h-screen flex items-center justify-center ">
          <ReactLoading
            type={"spinningBubbles"}
            color={"#17AFFA"}
            height={"60px"}
            width={"60px"}
          />
        </div>
      ) : (
        <div className="p-4">
          <div>
            <TitleComp title="Made in UAE Details" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setEditable(true)} variant="outline">
                    <span className="mr-3">Edit</span> <FaRegEdit />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click on it to start editing</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="mt-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                                disabled={!editable}
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
                    <div className="mb-2 flex items-center gap-4"></div>
                    <div className="relative">
                      <EditorCom
                        editorState={editorState}
                        setEditorState={handleSetEditorState}
                      />
                      {!editable && (
                        <div className=" absolute top-0 right-0 left-0 bottom-0 bg-[#7b7d83] opacity-20  hover:cursor-not-allowed z-50 "></div>
                      )}
                    </div>
                  </div>
                  <div className="lg:w-[50%] flex flex-col ">
                    <div>
                      <h3 className="text-lg">Add Product Images</h3>
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
                              {editable && (
                                <Button
                                  onClick={() => handleRemoveImge(img)}
                                  variant={"ghost"}
                                  type="button"
                                  className="absolute z-20 right-1 top-1"
                                >
                                  <RiDeleteBin5Line className="text-xl" />
                                </Button>
                              )}
                            </div>
                          ))}
                          {blogData?.blogData.images.map((img) => (
                            <div className=" w-[10rem] h-[14rem]  bg-[#f8f2f0] relative border-2 border-white rounded-md overflow-hidden hover:shadow-md cursor-pointer">
                              <Image
                                src={img}
                                alt=""
                                className="w-full h-full object-cover"
                                fill
                              />
                              {editable && (
                                <Button
                                  onClick={() => handleRemoveImg2(img)}
                                  variant={"ghost"}
                                  type="button"
                                  className="absolute z-20 right-1 top-1"
                                >
                                  <RiDeleteBin5Line className="text-xl" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3">
                          <Input
                            disabled={!editable}
                            type="file"
                            className="h-12 lg:w-[60%] cursor-pointer"
                            placeholder="enter..."
                            onChange={onImageChange}
                          />
                        </div>
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
                            <div className="bg-white p-4 rounded-md overflow-y-scroll md:w-[60%] min-h-[13rem] h-full">
                              {blogtypData?.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="blogType"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.id}
                                        className="flex flex-row my-2 items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            className="h-5 w-5"
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

                      <div className="w-full flex items-center mt-[2rem]">
                        <Button
                          loading={loading}
                          className={`h-12 w-[80%] md:w-[80%] ${
                            !editable
                              ? "bg-[#7b7d83] opacity-35 hover:cursor-not-allowed hover:bg-[#7b7d83]"
                              : ""
                          }`}
                          type="submit"
                          disabled={!editable}
                        >
                          Update Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
          <AddBlogType
            open={openBlogTypeModal}
            close={handleCloseBlogtypeModal}
          />
          <AlertComp
            loading={blogTypeDeleting}
            message="Are sure you want to delete this type?"
            open={openDialog}
            close={handleCloseDialog}
            onOk={() => handleDeleteBlogType(blogTypeId as any)}
          />
        </div>
      )}
    </>
  );
};

export default Page;
