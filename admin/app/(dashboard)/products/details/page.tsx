"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  RiDeleteBin5Line,
  RiDeleteBinLine,
  RiAddLine,
  RiFileDownloadLine,
  RiVideoLine,
} from "react-icons/ri";
import {
  FIREBASE_AUTH,
  FIREBASE_DB,
  FIREBASE_STORAGE,
} from "@/firebase/config";
import {
  ref as ImageRef,
  getDownloadURL,
  uploadBytes,
  type UploadResult,
} from "firebase/storage";
import {
  type DocumentData,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "@/components/ui/use-toast";
import useAsyncCaller from "@/hooks/useAsyncCaller";
import { AddCategory } from "@/components/ui/AddCategory";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import AlertComp from "@/components/ui/alertComp";
import { useSearchParams } from "next/navigation";
import ReactLoading from "react-loading";

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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import EditorCom from "../../newblog/section/Editor";

// Define the schema for course file links
const fileSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  type: z.string().min(1, { message: "Please select a file type" }),
  name: z.string().min(1, { message: "Please enter a file name" }),
});

// Define the schema for adding a new course
export const editCourseSchema = z.object({
  courseTitle: z
    .string()
    .min(3, { message: "Course title must be at least 3 characters" }),
  coursePrice: z.string().refine((val) => !isNaN(Number.parseFloat(val)), {
    message: "Price must be a valid number",
  }),
  category: z.string().optional(),
  videoEmbed: z.string().optional(),
  downloadLink: z
    .string()
    .url({ message: "Please enter a valid download URL" })
    .optional(),
  files: z.array(fileSchema).optional(),
});

// File type options
const fileTypes = [
  { value: "pdf", label: "PDF Document" },
  { value: "zip", label: "ZIP Archive" },
  { value: "rar", label: "RAR Archive" },
  { value: "doc", label: "Word Document" },
  { value: "xls", label: "Excel Spreadsheet" },
  { value: "ppt", label: "PowerPoint Presentation" },
  { value: "mp4", label: "Video File" },
  { value: "mp3", label: "Audio File" },
  { value: "other", label: "Other" },
];

const EditCoursePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as any;
  const [user] = useAuthState(FIREBASE_AUTH);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [categoryDeleting, setCategoryDeleting] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string>();
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [editorState, setEditorState] = useState("");
  const [courseData, setCourseData] = useState<any>(null);
  const [category, setCategory] = useState("");

  // State for file links
  const [fileLinks, setFileLinks] = useState<
    Array<{
      url: string;
      type: string;
      name: string;
    }>
  >([]);

  // State for new file link being added
  const [newFileLink, setNewFileLink] = useState({
    url: "",
    type: "pdf",
    name: "",
  });

  const form = useForm<z.infer<typeof editCourseSchema>>({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      courseTitle: "",
      coursePrice: "",
      category: "",
      videoEmbed: "",
      downloadLink: "",
      files: [],
    },
  });

  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [existingThumbnails, setExistingThumbnails] = useState<string[]>([]);
  const { handler: handleUpdateCourseCaller, loading } = useAsyncCaller();
  const [categoriesData, setCategoriesData] = useState<
    { id: string; name: string }[] | undefined
  >();
  const [categories, CategoriesLoading, error] = useCollection(
    collection(FIREBASE_DB, "categories"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [value, courseLoading, courseError] = useDocument(
    doc(FIREBASE_DB, "courses", id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    if (value?.exists()) {
      const data = value.data();
      setCourseData(data);

      // Set form values
      form.setValue("courseTitle", data.courseData.title);
      form.setValue("coursePrice", data.courseData.price.toString());
      form.setValue("category", data.courseData.category);
      setCategory(data.courseData.category);
      form.setValue("videoEmbed", data.courseData.videoEmbed || "");
      form.setValue("downloadLink", data.courseData.downloadLink || "");

      // Set editor state
      setEditorState(data.courseData.description || "");

      // Set file links
      if (data.courseData.files && data.courseData.files.length > 0) {
        setFileLinks(data.courseData.files);
      }

      // Set existing thumbnails
      if (data.courseData.thumbnails && data.courseData.thumbnails.length > 0) {
        setExistingThumbnails(data.courseData.thumbnails);
      }
    }
  }, [value, form]);

  const onThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageList = [
        ...thumbnails,
        URL.createObjectURL(event.target.files[0]),
      ];
      setThumbnails(imageList);
    }
  };

  const handleOpenCategoryModal = () => {
    setOpenCategoryModal(false);
  };

  const handleRemoveThumbnail = (img: string) => {
    const filteredImg = thumbnails.filter((i) => i !== img);
    setThumbnails(filteredImg);
  };

  const handleRemoveExistingThumbnail = (img: string) => {
    const filteredImg = existingThumbnails.filter((i) => i !== img);
    setExistingThumbnails(filteredImg);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteCategory = async (id: string) => {
    setCategoryDeleting(true);
    await deleteDoc(doc(FIREBASE_DB, "categories", id));
    toast({
      variant: "default",
      title: "Category deleted successfully",
    });
    handleCloseDialog();
    setCategoryDeleting(false);
  };

  const addFileLink = () => {
    if (newFileLink.url && newFileLink.type && newFileLink.name) {
      setFileLinks([...fileLinks, { ...newFileLink }]);
      setNewFileLink({ url: "", type: "pdf", name: "" });
    } else {
      toast({
        variant: "destructive",
        title: "Please fill all file link fields",
      });
    }
  };

  const removeFileLink = (index: number) => {
    const updatedLinks = [...fileLinks];
    updatedLinks.splice(index, 1);
    setFileLinks(updatedLinks);
  };

  useEffect(() => {
    if (categories) {
      const newCatList: DocumentData = [];
      categories.docs.map((doc) => {
        newCatList.push({ ...doc.data(), id: doc.id });
      });
      setCategoriesData(newCatList as any);
    }
  }, [categories]);

  const cleanForm = () => {
    if (courseData) {
      // Reset to original values
      form.setValue("courseTitle", courseData.courseData.title);
      form.setValue("coursePrice", courseData.courseData.price.toString());
      form.setValue("category", courseData.courseData.category);
      form.setValue("videoEmbed", courseData.courseData.videoEmbed || "");
      form.setValue("downloadLink", courseData.courseData.downloadLink || "");

      setEditorState(courseData.courseData.description || "");
      setFileLinks(courseData.courseData.files || []);
      setExistingThumbnails(courseData.courseData.thumbnails || []);
      setThumbnails([]);
    }
  };

  const handleSetEditorState = (e: any) => {
    setEditorState(e);
  };

  async function onSubmit(values: z.infer<typeof editCourseSchema>) {
    console.log(values);
    // try {
    //   await handleUpdateCourseCaller(async () => {
    //     const thumbnailUrls: string[] = [];

    //     // Upload new thumbnails if any
    //     if (thumbnails.length > 0) {
    //       for (let i = 0; i < thumbnails.length; i++) {
    //         const response = await fetch(thumbnails[i]);
    //         const blob = await response.blob();
    //         const storageRef = ImageRef(
    //           FIREBASE_STORAGE,
    //           "course-thumbnails/" +
    //             new Date().getTime() +
    //             Math.round(Math.random() * 999)
    //         );
    //         const uploadTask: UploadResult = await uploadBytes(
    //           storageRef,
    //           blob
    //         );
    //         const imageUrl = await getDownloadURL(uploadTask.ref);
    //         thumbnailUrls.push(imageUrl);
    //       }
    //     }

    //     // Update course in Firestore
    //     await updateDoc(doc(FIREBASE_DB, "courses", id), {
    //       adminEmail: user?.email,
    //       courseData: {
    //         title: values.courseTitle,
    //         description: editorState,
    //         price: Number.parseFloat(values.coursePrice),
    //         category: category,
    //         videoEmbed: values.videoEmbed,
    //         downloadLink: values.downloadLink,
    //         files: fileLinks,
    //         thumbnails: [...existingThumbnails, ...thumbnailUrls],
    //       },
    //       updatedAt: serverTimestamp(),
    //     });

    //     toast({
    //       variant: "default",
    //       title: "Course updated successfully",
    //     });

    //     // Refresh the data
    //     const updatedDoc = await getDoc(doc(FIREBASE_DB, "courses", id));
    //     setCourseData(updatedDoc.data());
    //     setThumbnails([]);
    //   });
    // } catch (err) {
    //   console.log(err);
    //   toast({
    //     variant: "destructive",
    //     title: "Error updating course",
    //     description: "Please try again later",
    //   });
    // }
  }

  if (courseLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <ReactLoading
          type={"spinningBubbles"}
          color={"#17AFFA"}
          height={"60px"}
          width={"60px"}
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="sm:p-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Edit Course</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => cleanForm()}>
              <RiDeleteBin5Line className="mr-2 h-4 w-4" /> Reset Changes
            </Button>
          </div>
        </div>

        <Card className="shadow-md border-0">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Left sidebar with tabs */}
              <div className="md:w-64 border-r bg-gray-50">
                <div className="p-4">
                  <h3 className="font-medium text-gray-500 mb-4">
                    Course Sections
                  </h3>
                  <Tabs
                    defaultValue="basic"
                    className="w-full"
                    orientation="vertical"
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                      <TabsTrigger
                        value="basic"
                        className={`justify-start px-3 py-2 h-auto ${
                          activeTab === "basic"
                            ? "bg-white shadow-sm"
                            : "bg-transparent"
                        }`}
                      >
                        1. Basic Information
                      </TabsTrigger>
                      <TabsTrigger
                        value="content"
                        className={`justify-start px-3 py-2 h-auto ${
                          activeTab === "content"
                            ? "bg-white shadow-sm"
                            : "bg-transparent"
                        }`}
                      >
                        2. Course Content
                      </TabsTrigger>
                      <TabsTrigger
                        value="media"
                        className={`justify-start px-3 py-2 h-auto ${
                          activeTab === "media"
                            ? "bg-white shadow-sm"
                            : "bg-transparent"
                        }`}
                      >
                        3. Media & Files
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Main content area */}
              <div className="flex-1 p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    {activeTab === "basic" && (
                      <div className="space-y-8">
                        <div className="grid gap-8 lg:grid-cols-1">
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="courseTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-medium">
                                    Course Title
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      className="h-12"
                                      placeholder="Enter course title"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="coursePrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-medium">
                                    Course Price ($)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      className="h-12"
                                      placeholder="Enter course price"
                                      type="number"
                                      step="0.01"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex items-center gap-4">
                              <div className="w-full">
                                <FormField
                                  control={form.control}
                                  name="category"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-base font-medium">
                                        Category
                                      </FormLabel>
                                      <Select
                                        onValueChange={(v) => setCategory(v)}
                                        defaultValue={category}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="h-12">
                                            <SelectValue placeholder="Select category" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {categoriesData?.map((cat) => (
                                            <div
                                              className="relative"
                                              key={cat.id}
                                            >
                                              <SelectItem
                                                value={cat.name}
                                                className="py-3"
                                              >
                                                {cat.name}
                                              </SelectItem>
                                              <span
                                                onClick={() => {
                                                  setOpenDialog(true);
                                                  setCategoryId(cat.id);
                                                }}
                                                className="absolute right-3 py-2 px-3 hover:bg-gray-100 rounded-full cursor-pointer top-1"
                                              >
                                                <RiDeleteBinLine className="text-gray-500 hover:text-red-500" />
                                              </span>
                                            </div>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <div className="flex justify-end mt-2">
                                        <Button
                                          onClick={() =>
                                            setOpenCategoryModal(true)
                                          }
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          className="text-xs"
                                        >
                                          <RiAddLine className="mr-1" /> Add
                                          Category
                                        </Button>
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <div>
                              <FormLabel className="text-base font-medium">
                                Course Description
                              </FormLabel>
                              <EditorCom
                                height={400}
                                editorState={editorState}
                                setEditorState={handleSetEditorState}
                              />
                              <FormDescription>
                                Provide a comprehensive description of what
                                students will learn
                              </FormDescription>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-6">
                          <Button
                            type="button"
                            onClick={() => setActiveTab("content")}
                            className="px-6"
                          >
                            Next: Course Content
                          </Button>
                        </div>
                      </div>
                    )}

                    {activeTab === "content" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">
                            Video Content
                          </h3>
                          <FormField
                            control={form.control}
                            name="videoEmbed"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium">
                                  Embedded Video
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    className="font-mono text-sm"
                                    placeholder='<iframe src="https://drive.google.com/file/d/xxx/preview" className="w-full h-full" allow="autoplay; fullscreen" title="Course Video"></iframe>'
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      // Check if this is a Google Drive file ID
                                      const driveIdMatch = value.match(
                                        /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
                                      );
                                      if (driveIdMatch && driveIdMatch[1]) {
                                        const fileId = driveIdMatch[1];
                                        const formattedEmbed = `<iframe src="https://drive.google.com/file/d/${fileId}/preview" className="w-full h-full" allow="autoplay; fullscreen" title="AI - Is it Software or Hardware"></iframe>`;
                                        field.onChange(formattedEmbed);
                                      } else {
                                        field.onChange(value);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Paste the iframe embed code or Google Drive
                                  link, and it will be automatically formatted
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("videoEmbed") && (
                            <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <RiVideoLine className="mr-2 text-primary" />{" "}
                                Video Preview
                              </h4>
                              <div className="rounded-md overflow-hidden">
                                <div
                                  className="w-full"
                                  dangerouslySetInnerHTML={{
                                    __html: form.watch("videoEmbed") || "",
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-4">
                            Main Download Link
                          </h3>
                          <FormField
                            control={form.control}
                            name="downloadLink"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium">
                                  Primary Download URL
                                </FormLabel>
                                <FormControl>
                                  <div className="flex items-center">
                                    <RiFileDownloadLine className="text-gray-400 mr-2" />
                                    <Input
                                      className="h-12"
                                      placeholder="https://example.com/download/course-materials.zip"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Main download link for course materials
                                  (optional)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-between mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab("basic")}
                          >
                            Back
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setActiveTab("media")}
                            className="px-6"
                          >
                            Next: Media & Files
                          </Button>
                        </div>
                      </div>
                    )}

                    {activeTab === "media" && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-medium mb-4">
                            Course Thumbnails
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                            {existingThumbnails.map((img, index) => (
                              <div
                                key={`existing-${index}`}
                                className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-all"
                              >
                                <Image
                                  src={img || "/placeholder.svg"}
                                  alt={`Thumbnail ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveExistingThumbnail(img)
                                    }
                                    variant="destructive"
                                    size="sm"
                                    className="rounded-full w-8 h-8 p-0"
                                  >
                                    <RiDeleteBin5Line />
                                  </Button>
                                </div>
                                {index === 0 && (
                                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                    Main
                                  </div>
                                )}
                              </div>
                            ))}

                            {thumbnails.map((img, index) => (
                              <div
                                key={`new-${index}`}
                                className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-all"
                              >
                                <Image
                                  src={img || "/placeholder.svg"}
                                  alt={`New Thumbnail ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button
                                    type="button"
                                    onClick={() => handleRemoveThumbnail(img)}
                                    variant="destructive"
                                    size="sm"
                                    className="rounded-full w-8 h-8 p-0"
                                  >
                                    <RiDeleteBin5Line />
                                  </Button>
                                </div>
                                {existingThumbnails.length === 0 &&
                                  index === 0 && (
                                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                      Main
                                    </div>
                                  )}
                              </div>
                            ))}

                            {existingThumbnails.length === 0 &&
                              thumbnails.length === 0 && (
                                <div className="col-span-full flex items-center justify-center h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                                  <p className="text-gray-500 text-center">
                                    No thumbnails added yet.
                                    <br />
                                    Add at least one thumbnail image.
                                  </p>
                                </div>
                              )}
                          </div>

                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              accept="image/*"
                              className="h-12 cursor-pointer"
                              onChange={onThumbnailChange}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                document
                                  .querySelector<HTMLInputElement>(
                                    'input[type="file"]'
                                  )
                                  ?.click()
                              }
                              className="whitespace-nowrap"
                            >
                              Browse Files
                            </Button>
                          </div>
                          <FormDescription className="mt-2">
                            The first image will be used as the main thumbnail
                          </FormDescription>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-4">
                            Additional File Links
                          </h3>

                          <div className="space-y-4 mb-6">
                            {fileLinks.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow"
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800">
                                    {file.name}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center mt-1">
                                    <span
                                      className={`bg-primary/10 text-primary px-2 py-0.5 rounded text-xs mr-2 font-medium`}
                                    >
                                      {file.type.toUpperCase()}
                                    </span>
                                    <span className="truncate">{file.url}</span>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFileLink(index)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full h-8 w-8 p-0"
                                >
                                  <RiDeleteBin5Line className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}

                            {fileLinks.length === 0 && (
                              <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">
                                  No additional file links added yet
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                              <FormLabel className="text-sm">
                                File Name
                              </FormLabel>
                              <Input
                                value={newFileLink.name}
                                onChange={(e) =>
                                  setNewFileLink({
                                    ...newFileLink,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Workbook PDF"
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <FormLabel className="text-sm">
                                File Type
                              </FormLabel>
                              <Select
                                value={newFileLink.type}
                                onValueChange={(value) =>
                                  setNewFileLink({
                                    ...newFileLink,
                                    type: value,
                                  })
                                }
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select file type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {fileTypes.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                    >
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <FormLabel className="text-sm">
                                File URL
                              </FormLabel>
                              <div className="flex mt-1">
                                <Input
                                  value={newFileLink.url}
                                  onChange={(e) =>
                                    setNewFileLink({
                                      ...newFileLink,
                                      url: e.target.value,
                                    })
                                  }
                                  placeholder="https://example.com/file.pdf"
                                  className="rounded-r-none"
                                />
                                <Button
                                  type="button"
                                  onClick={addFileLink}
                                  className="rounded-l-none"
                                >
                                  <RiAddLine className="mr-1" /> Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between mt-8">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab("content")}
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={loading}
                            className="px-8"
                          >
                            {loading ? "Updating..." : "Update Course"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </Form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddCategory open={openCategoryModal} close={handleOpenCategoryModal} />
      <AlertComp
        loading={categoryDeleting}
        message="Are you sure you want to delete this category?"
        open={openDialog}
        close={handleCloseDialog}
        onOk={() => handleDeleteCategory(categoryId as any)}
      />
    </div>
  );
};

export default EditCoursePage;
