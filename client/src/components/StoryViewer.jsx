import { useAuth, useUser } from "@clerk/clerk-react";
import { BadgeCheck, X, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../api/axios";

const StoryViewer = ({ viewStory, setViewStory }) => {
  const [progress, setProgress] = useState(0);
  const { getToken } = useAuth();
  const { user } = useUser();

  const isMyStory = viewStory?.user?._id === user?.id;

  useEffect(() => {
    if (!viewStory || isMyStory) return;

    const markAsViewed = async () => {
      try {
        const token = await getToken();
        await api.post(
          `/api/story/view/${viewStory._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error(err);
      }
    };

    markAsViewed();
  }, [viewStory, isMyStory]);

  useEffect(() => {
    if (!viewStory || viewStory.media_type === "video") return;

    setProgress(0);
    const duration = 10000;
    const stepTime = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += stepTime;
      setProgress((elapsed / duration) * 100);
    }, stepTime);

    const timer = setTimeout(() => {
      setViewStory(null);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [viewStory]);

  if (!viewStory) return null;

  const renderContent = () => {
    switch (viewStory.media_type) {
      case "image":
        return (
          <img
            src={viewStory.media_url}
            alt=""
            className="max-w-full max-h-screen object-contain"
          />
        );

      case "video":
        return (
          <video
            src={viewStory.media_url}
            className="max-h-screen"
            autoPlay
            controls
            onEnded={() => setViewStory(null)}
          />
        );

      case "text":
        return (
          <div className="w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center">
            {viewStory.content}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 h-screen bg-black bg-opacity-90 z-[110] flex items-center justify-center"
      style={{
        backgroundColor:
          viewStory.media_type === "text" ? viewStory.background_color : "#000",
      }}
    >
      {/* Progress Bar */}
      {viewStory.media_type !== "video" && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* User Info */}
      <div className="absolute top-4 left-4 flex items-center gap-3 px-4 py-2 bg-black/50 backdrop-blur rounded">
        <img
          src={viewStory.user?.profile_picture}
          className="size-8 rounded-full border border-white"
        />
        <div className="text-white flex items-center gap-1">
          {viewStory.user?.full_name}
          <BadgeCheck size={16} />
        </div>
      </div>

      {/* Close */}
      <button
        onClick={() => setViewStory(null)}
        className="absolute top-4 right-4 text-white"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Content */}
      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {renderContent()}
      </div>
      {isMyStory && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2
                          flex items-center gap-2
                          bg-black/60 text-white
                          px-4 py-2 rounded-full text-sm"
        >
          <Eye size={16} />
          <span>{viewStory.views_count?.length || 0}</span>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;
