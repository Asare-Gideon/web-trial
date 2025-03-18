import DashboardLayout from "@components/dashboard/DashboardLayout";
import SubscribedVideos from "@components/dashboard/SubscribedVideos";
import VideoInfo from "@components/dashboard/VideoInfo";
import VideoPlayer from "@components/dashboard/VideoPlayer";
import { ProductType } from "common/types";
import { FIREBASE_AUTH, PRODUCT_REF } from "../firebase/config";
import { query, where } from "firebase/firestore";
import { usePagination } from "hooks/usePagination";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import LoginPrompt from "@components/dashboard/LoingPromt";

export default function VideoPage() {
  const [selectedVideo, setSelectedVideo] = useState<ProductType>();
  const [user, loading, error] = useAuthState(FIREBASE_AUTH);
  const { items, isLoading, isStart, isEnd, getPrev, getNext } =
    usePagination<ProductType>(
      user
        ? query(
            PRODUCT_REF,
            where("visible", "==", true),
            where("purchaseUsers", "array-contains", user?.email)
          )
        : query(PRODUCT_REF, where("visible", "==", true)),
      {
        limit: 10,
      }
    );

  useEffect(() => {
    setSelectedVideo(items[0]);
  }, [items]);

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
                  items={items}
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
