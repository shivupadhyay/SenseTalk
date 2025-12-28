import React from "react";
import { dummyConnectionsData } from "../assets/assets";
import { Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Messages = () => {
  const { connections } = useSelector((state) => state.connections);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Messages
          </h1>
          <p className="text-slate-500 mt-2">Chat with your connections</p>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {connections.map((user) => (
            <div
              key={user._id}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              {/* Avatar */}
              <img
                src={user.profile_picture}
                alt={user.full_name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
              />

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800 truncate">
                    {user.full_name}
                  </p>
                </div>
                <p className="text-sm text-slate-500 truncate">
                  @{user.username}
                </p>
                <p className="text-sm text-slate-600 truncate mt-1">
                  {user.bio || "No bio available"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {connections.length === 0 && (
          <div className="text-center py-24">
            <MessageSquare className="w-14 h-14 mx-auto text-slate-300" />
            <p className="text-slate-500 mt-4">No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
