import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const NotificationLikes = () => {
  const [notifyLikes, setNotifyLikes] = useState([]);
  const { getToken } = useAuth();
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const token = await getToken();
        const { data } = await api.get("/api/notifications/likes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifyLikes(data.notificationLikes);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchLikes();
  }, [getToken]);
  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold text-center mb-6">Notifications</h2>

      {notifyLikes.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No notifications yet
        </div>
      )}

      <div className="max-w-xl mx-auto space-y-3">
        {notifyLikes.map((n, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex items-center justify-between"
          >
            {/* Left: Profile + Text */}
            <div className="flex items-center gap-3">
              <img
                src={n.profile_picture}
                alt="user"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{n.username}</p>
                <p className="text-sm text-gray-500">liked your post</p>
                <p className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Right: Post Thumbnail */}
            {n.postThumbnail && (
              <img
                src={n.postThumbnail}
                alt="post"
                className="w-14 h-14 rounded object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationLikes;
