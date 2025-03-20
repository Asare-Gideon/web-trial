import DashboardLayout from "@components/dashboard/DashboardLayout";
import SubscribedVideos from "@components/dashboard/SubscribedVideos";
import VideoInfo from "@components/dashboard/VideoInfo";
import VideoPlayer from "@components/dashboard/VideoPlayer";
import { ProductType } from "common/types";
import { FIREBASE_AUTH, PRODUCT_REF } from "../firebase/config";
import { query, where, getDocs } from "firebase/firestore";
import { usePagination } from "hooks/usePagination";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import LoginPrompt from "@components/dashboard/LoingPromt";

export default function VideoPage() {
  const [selectedVideo, setSelectedVideo] = useState<ProductType>();
  const [user, loading, error] = useAuthState(FIREBASE_AUTH);
  const [mergedItems, setMergedItems] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      fetchVisibleCourses();
    } else {
      fetchMergedCourses(user?.email as any);
    }
  }, [user]);

  // Fetch only visible free courses
  const fetchVisibleCourses = async () => {
    setIsLoading(true);
    try {
      const freeCoursesQuery = query(
        PRODUCT_REF,
        where("visible", "==", true),
        where("courseData.price", "==", 0)
      );
      const freeCoursesSnap = await getDocs(freeCoursesQuery);
      const freeCourses = freeCoursesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProductType[];

      setMergedItems(freeCourses);
    } catch (error) {
      console.error("Error fetching free courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch both free and subscribed courses, then merge
  const fetchMergedCourses = async (email: string) => {
    setIsLoading(true);
    try {
      const freeCoursesQuery = query(
        PRODUCT_REF,
        where("visible", "==", true),
        where("courseData.price", "==", 0)
      );
      const subscribedCoursesQuery = query(
        PRODUCT_REF,
        where("visible", "==", true),
        where("purchaseUsers", "array-contains", email)
      );

      const [freeCoursesSnap, subscribedCoursesSnap] = await Promise.all([
        getDocs(freeCoursesQuery),
        getDocs(subscribedCoursesQuery),
      ]);

      const freeCourses = freeCoursesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProductType[];

      const subscribedCourses = subscribedCoursesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProductType[];

      // Merge both results while removing duplicates
      const mergedCourses = [
        ...freeCourses,
        ...subscribedCourses.filter(
          (subCourse) => !freeCourses.some((free) => free.id === subCourse.id)
        ),
      ];

      setMergedItems(mergedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mergedItems.length > 0) {
      setSelectedVideo(mergedItems[0]);
    }
  }, [mergedItems]);

  const handleSelectedVideo = (val: ProductType) => {
    setSelectedVideo(val);
  };

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center ">
          <ReactLoading
            type={"bars"}
            color={"#db9175"}
            height={"60px"}
            width={"60px"}
          />
        </div>
      ) : (
        <>
          {user ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray100">
              <div className="lg:col-span-2 space-y-4">
                <VideoPlayer
                  embeded={selectedVideo?.courseData.videoEmbed || ""}
                />
                <VideoInfo item={selectedVideo as any} />
              </div>
              <div className="lg:col-span-1">
                <SubscribedVideos
                  items={mergedItems}
                  handleSelected={handleSelectedVideo}
                />
              </div>
            </div>
          ) : (
            <LoginPrompt />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
