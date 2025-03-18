import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@components/components/ui/avatar";
import { Button } from "@components/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/components/ui/tabs";
import { ProductType } from "common/types";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebase/config";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { commonType } from "context/cart/cart-types";
import { formatDistanceToNow } from "date-fns";

type CommentType = {
  name: string;
  email: string;
  comment: string;
  createdAt: any;
};

export const getRelativeTime = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export default function VideoInfo({ item }: { item: ProductType }) {
  const [active, setActive] = useState("description");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [user, loading, error] = useAuthState(FIREBASE_AUTH);
  const [email, setEmail] = useState("");

  const hanldeActiveChange = (val: string) => {
    setActive(val);
  };

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const addCommentToCourse = async (
    courseId: string,
    commentData: Omit<CommentType, "createdAt">
  ) => {
    if (!courseId) {
      console.error("Course ID is required");
      return;
    }

    if (!commentData.name || !commentData.email || !commentData.comment) {
      console.error("Invalid comment data");
      return;
    }

    try {
      const courseRef = doc(FIREBASE_DB, "courses", courseId);

      const courseSnap = await getDoc(courseRef);
      if (!courseSnap.exists()) {
        console.error("Course not found");
        return;
      }

      const newComment: CommentType = {
        ...commentData,
        createdAt: new Date().toISOString(),
      };

      await updateDoc(courseRef, {
        comments: arrayUnion(newComment),
      });

      console.log("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const listenToCourseComments = (
    courseId: string,
    callback: (comments: CommentType[]) => void
  ) => {
    if (!courseId) {
      console.error("Course ID is required");
      return;
    }

    const courseRef = doc(FIREBASE_DB, "courses", courseId);

    const unsubscribe = onSnapshot(courseRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const comments: CommentType[] = data.comments || [];
        callback(comments);
      } else {
        console.error("Course not found");
        callback([]); // Return an empty array if the course does not exist
      }
    });

    return unsubscribe;
  };
  const getInitials = (fullName: string): string => {
    if (!fullName) return "";

    return fullName
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  useEffect(() => {
    if (!item) return;

    const unsubscribe = listenToCourseComments(item.id, (newComments) => {
      setComments(newComments);
    }) as any;

    return () => unsubscribe();
  }, [item]);

  const handleMakeComments = async () => {
    let res = await getDoc(doc(FIREBASE_DB, "users", email));
    if (res) {
      let com = {
        name: res.data()?.name,
        email: res.data()?.email,
        comment: comment,
      };
      await addCommentToCourse(item.id, com);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold">{item?.courseData.title}</h1>
        <div className="bg-white rounded-lg flex flex-wrap gap-4 justify-between shadow-sm">
          <div className="flex items-center gap-6"></div>
          <div>
            <Link href={item?.courseData.downloadLink || ""}>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="description"
        className="bg-white rounded-lg shadow-sm"
      >
        <TabsList className="grid w-full grid-cols-3 p-2 bg-white ">
          <TabsTrigger
            onClick={() => hanldeActiveChange("description")}
            value="description"
            className={`data-[state=active]:bg-white ${
              active == "description" && " bg-primary text-white"
            } py-2 data-[state=active]:shadow-sm`}
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            onClick={() => hanldeActiveChange("resources")}
            value="resources"
            className={`data-[state=active]:bg-white ${
              active == "resources" && " bg-primary text-white"
            } py-2 data-[state=active]:shadow-sm`}
          >
            Resources
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            onClick={() => hanldeActiveChange("comments")}
            className={`data-[state=active]:bg-white ${
              active == "comments" && " bg-primary text-white"
            } py-2 data-[state=active]:shadow-sm`}
          >
            Comments
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="description"
          className="p-4 bg-white rounded-b-lg min-h-32"
        >
          <div className="space-y-4 bg-gray100 p-4">
            <div
              dangerouslySetInnerHTML={{
                __html: item?.courseData.description,
              }}
            ></div>
          </div>
        </TabsContent>
        <TabsContent
          value="resources"
          className="p-4 bg-white rounded-b-lg min-h-32"
        >
          <div className="space-y-4 bg-gray100 p-4">
            <h3 className="font-medium">Course Materials</h3>
            <ul className="space-y-2">
              {item?.courseData.files.map((file: any) => (
                <li className="flex items-center gap-2 p-2 rounded-md  bg-white hover:bg-slate-50">
                  <div className="p-2 bg-primary/10 rounded-md text-primary">
                    {file.type}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                  </div>
                  <Link href={file.url}>
                    <Button size="sm" variant="outline">
                      Download
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent
          value="comments"
          className="p-4 bg-white rounded-b-lg min-h-32"
        >
          <div className="space-y-4 bg-gray100 p-4">
            <div className="flex items-center gap-4 pb-4">
              <div className="flex-1">
                <input
                  onChange={(val) => setComment(val.target.value)}
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full p-2 bg-white rounded-md border"
                />
              </div>
              <Button
                onClick={handleMakeComments}
                className="text-white"
                size="sm"
              >
                Comment
              </Button>
            </div>
            {comments.length < 1 ? (
              <div className="flex justify-center w-full h-32">
                <h1>No comments yet</h1>
              </div>
            ) : (
              <>
                {comments.map((com) => (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 justify-center bg-white border-white shadow-sm">
                        <AvatarImage
                          src="/placeholder.svg?height=32&width=32"
                          alt="User"
                        />
                        <AvatarFallback>{getInitials(com.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{com.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {getRelativeTime(com.createdAt)}
                          </p>
                        </div>
                        <p className="mt-1">{com.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
