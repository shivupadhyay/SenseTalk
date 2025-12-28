import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  UserRoundPen,
  MessageSquare,
} from "lucide-react";

import { data, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { fetchConnections } from "../features/connections/connectionSlice";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const Connections = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const [acceptLoading, setAcceptLoading] = useState({});
  const { connections, pendingConnections, followers, following } = useSelector(
    (state) => state.connections
  );
  const dataArray = [
    { label: "Followers", value: followers, icon: Users },
    { label: "Following", value: following, icon: UserCheck },
    { label: "Pending", value: pendingConnections, icon: UserRoundPen },
    { label: "Connections", value: connections, icon: UserPlus },
  ];
  const [currentTab, setCurrentTab] = useState("Followers");

  const handleUnfollow = async (userId) => {
    try {
      const { data } = await api.post(
        "/api/user/unfollow",
        { id: userId },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        dispatch(fetchConnections(await getToken()));
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const acceptConnection = async (userId) => {
    if (acceptLoading[userId]) return;
    setAcceptLoading((prev) => ({
      ...prev,
      [userId]: true,
    }));
    try {
      const { data } = await api.post(
        "/api/user/accept",
        { id: userId },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        dispatch(fetchConnections(await getToken()));
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAcceptLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchConnections(token));
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Connections
          </h1>
          <p className="text-slate-500 mt-2">
            Manage followers, requests, and conversations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-10">
          {dataArray.map((item) => (
            <div
              key={item.label}
              className="relative p-5 rounded-xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              <item.icon className="absolute right-4 top-4 w-6 h-6 text-slate-400" />
              <p className="text-3xl font-bold text-slate-900">
                {item.value.length}
              </p>
              <p className="text-sm text-slate-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="sticky top-4 z-10 inline-flex gap-1 p-1 rounded-xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm">
          {dataArray.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setCurrentTab(tab.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                currentTab === tab.label
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className="text-xs opacity-70">{tab.value.length}</span>
            </button>
          ))}
        </div>

        {/* Users List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {dataArray
            .find((item) => item.label === currentTab)
            ?.value.map((user) => (
              <div
                key={user._id}
                className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.profile_picture}
                    alt={user.full_name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <p className="font-semibold text-slate-800">
                      {user.full_name}
                    </p>
                    <p className="text-sm text-slate-500">@{user.username}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                  {user.bio || "No bio available"}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  <button
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition"
                  >
                    View Profile
                  </button>

                  {currentTab === "Following" && (
                    <button
                      onClick={() => handleUnfollow(user._id)}
                      className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm hover:bg-slate-200 transition"
                    >
                      Unfollow
                    </button>
                  )}

                  {currentTab === "Pending" && (
                    <button
                      onClick={() => acceptConnection(user._id)}
                      disabled={acceptLoading[user._id]}
                      className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      {acceptLoading[user._id] ? "Accepting..." : "Accept"}
                    </button>
                  )}

                  {currentTab === "Connections" && (
                    <button
                      onClick={() => navigate(`/messages/${user._id}`)}
                      className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm hover:bg-slate-200 transition flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Empty State */}
        {dataArray.find((i) => i.label === currentTab)?.value.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-slate-500 mt-3">
              No users found in this section
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
