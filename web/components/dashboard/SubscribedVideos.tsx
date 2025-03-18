import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@components/components/ui/avatar";
import { usePagination } from "hooks/usePagination";
import { ProductType } from "common/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB, PRODUCT_REF } from "../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { getRelativeTime } from "./VideoInfo";
import { format } from "date-fns";

type VideoItem = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  watched: boolean;
  progress?: number;
};

export default function SubscribedVideos({
  items,
  handleSelected,
}: {
  items: ProductType[];
  handleSelected: (val: ProductType) => void;
}) {
  const [playing, setPlaying] = useState("");
  const [user, loading, error] = useAuthState(FIREBASE_AUTH);
  const [recomendedVideos, setRecomendedVideos] = useState<any[]>();

  const getVideosWithoutPurchase = async (userEmail: string) => {
    const videoQuery = query(
      collection(FIREBASE_DB, "courses"),
      where("visible", "==", true)
    );

    const snapshot = await getDocs(videoQuery);
    const videosWithoutPurchase = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((video: any) => !video.purchaseUsers?.includes(userEmail))
      .slice(0, 3);

    return videosWithoutPurchase;
  };

  const handleRecomendedVideos = async () => {
    if (user?.email) {
      let recVideo = await getVideosWithoutPurchase(user.email);
      setRecomendedVideos(recVideo);
    }
  };

  useEffect(() => {
    if (items && items.length > 0) {
      setPlaying(items[0].id);
    }
    handleRecomendedVideos();
  }, []);

  const handleSetPlaying = (id: string) => {
    setPlaying(id);
  };

  const getInitials = (fullName: string): string => {
    if (!fullName) return "";

    return fullName
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Subscriptions</h2>
      </div>

      <div className="space-y-4">
        {items.map((video, index) => (
          <Link
            key={video.id}
            href={``}
            onClick={() => {
              handleSelected(video);
              setPlaying(video.id);
            }}
            className="flex gap-3 group p-2 rounded-md hover:bg-slate-50"
          >
            <div className="relative w-40 min-w-[160px] rounded-md overflow-hidden  shadow-sm">
              <Image
                src={video.courseData.thumbnails[0]}
                alt={video.courseData.title}
                width={180}
                height={90}
                className="object-cover aspect-video group-hover:scale-105 transition-transform duration-200"
              />
              {/* <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                {video.duration}
              </div> */}

              {playing === video.id && (
                <div className="absolute top-1 left-1 bg-primary text-xs text-white px-1.5 py-0.5 rounded-sm">
                  Playing
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium w-2/3 text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {video.courseData.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Kmtec</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-3">Recommended Courses</h3>
        <div className="space-y-4">
          {recomendedVideos && (
            <>
              {recomendedVideos.map((vid) => (
                <Link
                  href={`/products/${vid.id}`}
                  className="block p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                >
                  <h4 className="font-medium">{vid.courseData.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(vid.date.toDate(), "yyyy-MM-dd")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs">{vid.courseData.category}</span>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
