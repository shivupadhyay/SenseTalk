// import React, { useEffect, useRef, useState } from "react";
// import { dummyMessagesData, dummyUserData } from "../assets/assets";
// import { ImageIcon, SendHorizonal } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { useAuth } from "@clerk/clerk-react";
// import api from "../api/axios";
// import { addMessage, resetMessages } from "../features/messages/messagesSlice";
// import { toast } from "react-hot-toast";
// import { fetchUser } from "../features/user/userSlice";
// import { fetchMessages } from "../features/messages/messagesSlice";
// import EmojiPicker from "emoji-picker-react";

// const ChatBox = () => {
//   const { messages } = useSelector((state) => state.messages);
//   const { userId } = useParams();
//   const { getToken } = useAuth();
//   const dispatch = useDispatch();
//   const [text, setText] = useState("");
//   const [image, setImage] = useState(null);
//   const [user, setUser] = useState(null);
//   const [showEmojiPicker, setEmojiPicker] = useState(false);
//   const messagesEndRef = useRef(null);

//   const connections = useSelector((state) => state.connections.connections);

//   const fetchUserMessages = async () => {
//     try {
//       const token = await getToken();
//       dispatch(fetchMessages({ token, userId }));
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const sendMessage = async () => {
//     try {
//       if (!text && !image) {
//         return;
//       }
//       const token = await getToken();
//       const formData = new FormData();
//       formData.append("to_user_id", userId);
//       formData.append("text", text);
//       image && formData.append("image", image);

//       const { data } = await api.post("/api/message/send", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (data.success) {
//         setText("");
//         setImage(null);
//         dispatch(addMessage(data.message));
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (connections.length > 0) {
//       const user = connections.find((connection) => connection._id === userId);
//       setUser(user);
//     }
//   }, [connections, userId]);
//   useEffect(() => {
//     fetchUserMessages();
//     return () => {
//       dispatch(resetMessages());
//     };
//   }, [userId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages]);

//   return (
//     user && (
//       <div className="flex flex-col h-screen">
//         <div className="flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300 ">
//           <img
//             src={user.profile_picture}
//             alt=""
//             className="size-8 rounded-full"
//           />
//           <div>
//             <p className="font-medium">{user.full_name}</p>
//             <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
//           </div>
//         </div>
//         <div className="p-5 md:px-10 h-full overflow-y-scroll">
//           <div className="space-y-4 max-w-4xl mx-auto">
//             {messages
//               .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
//               .map((message, index) => (
//                 <div
//                   key={index}
//                   className={`flex flex-col ${
//                     message.to_user_id !== user._id
//                       ? "items-start"
//                       : "items-end"
//                   }`}
//                 >
//                   <div
//                     className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${
//                       message.to_user_id !== user._id
//                         ? "rounded-bl-none"
//                         : "rounded-br-none"
//                     }`}
//                   >
//                     {message.message_type === "image" && (
//                       <img
//                         src={message.media_url}
//                         className="w-full max-w-sm rounded-lg mb-1"
//                         alt=""
//                       />
//                     )}

//                     <p>{message.text}</p>
//                   </div>
//                 </div>
//               ))}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>
//         <div className="px-4">
//           <div className="flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5">
//             <button
//               onClick={() => setEmojiPicker(!showEmojiPicker)}
//               className="text-2xl cursor-pointer"
//             >
//               😀
//             </button>
//             {showEmojiPicker && (
//               <div className="absolute bottom-20 left-1/2  -translate-x-1/2 w-full px-3 md:w-auto md:px-0 flex justify-center animate-fadeInUp z-[999]">
//                 <div
//                   className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]
//          p-3  w-full md:w-[380px] overflow-hidden epr-body"
//                 >
//                   <EmojiPicker
//                     onEmojiClick={(emoji) =>
//                       setText((prev) => prev + emoji.emoji)
//                     }
//                   />
//                 </div>
//               </div>
//             )}
//             <input
//               type="text"
//               className="flex-1 outline-none text-slate-700"
//               placeholder="Type a message..."
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               onFocus={() => setEmojiPicker(false)}
//               onChange={(e) => setText(e.target.value)}
//               value={text}
//             />
//             <label htmlFor="image">
//               {image ? (
//                 <img src={URL.createObjectURL(image)} className="h-8 rounded" />
//               ) : (
//                 <ImageIcon className="size-7 text-gray-400 cursor-pointer" />
//               )}
//               <input
//                 type="file"
//                 id="image"
//                 accept="image/*"
//                 hidden
//                 onChange={(e) => setImage(e.target.files[0])}
//               />
//             </label>
//             <button
//               onClick={sendMessage}
//               className="bg-gradient-to-br from-indigo-500 to-purple-600 hover: from-indigo-700 hover:to-purple-800 active: scale-95 cursor-pointer text-white p-2 rounded-full"
//             >
//               <SendHorizonal size={18} />
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   );
// };

// export default ChatBox;
import React, { useEffect, useRef, useState } from "react";
import { ImageIcon, SendHorizonal, Edit2, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import {
  addMessage,
  deleteMessage,
  editMessage,
  resetMessages,
} from "../features/messages/messagesSlice";
import { toast } from "react-hot-toast";
import { fetchMessages } from "../features/messages/messagesSlice";
import EmojiPicker from "emoji-picker-react";

const ChatBox = () => {
  const { messages } = useSelector((state) => state.messages);
  const { userId } = useParams();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [showEmojiPicker, setEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editModal, setEditModal] = useState({
    open: false,
    messageId: "",
    text: "",
  });
  const messagesEndRef = useRef(null);
  const { userId: myId } = useAuth();
  const connections = useSelector((state) => state.connections.connections);

  useEffect(() => {
    if (connections.length > 0) {
      const u = connections.find((c) => c._id === userId);
      setUser(u);
    }
  }, [connections, userId]);

  useEffect(() => {
    const fetchUserMessages = async () => {
      try {
        const token = await getToken();
        dispatch(fetchMessages({ token, userId }));
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchUserMessages();
    return () => dispatch(resetMessages());
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE
  const sendMessage = async () => {
    try {
      if (!text && !image) return;

      const token = await getToken();
      const formData = new FormData();
      formData.append("to_user_id", userId);
      formData.append("text", text);
      image && formData.append("image", image);

      const { data } = await api.post("/api/message/send", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setText("");
        setImage(null);
        dispatch(addMessage(data.message));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // EDIT MESSAGE
  const handleEditMessage = async (messageId, newText) => {
    try {
      const token = await getToken();
      const { data } = await api.put(
        "/api/message/edit",
        { messageId, newText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        dispatch(editMessage({ messageId, newText }));
        setEditModal({ open: false, messageId: "", text: "" });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // DELETE MESSAGE
  const handleDeleteMessage = async (messageId) => {
    try {
      const token = await getToken();
      const { data } = await api.put(
        "/api/message/delete",
        { messageId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        dispatch(deleteMessage(messageId));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // SWIPE TO DELETE (simple mobile version)
  const handleSwipeDelete = (e, message) => {
    const touch = e.changedTouches[0];
    if (touch.clientX < 50 && message.from_user_id === user?._id) {
      handleDeleteMessage(message._id);
    }
  };

  return (
    user && (
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300">
          <img
            src={user.profile_picture}
            alt=""
            className="size-8 rounded-full"
          />
          <div>
            <p className="font-medium">{user.full_name}</p>
            <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="p-5 md:px-10 h-full overflow-y-scroll">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => (
                <div
                  key={index}
                  onTouchStart={() => setSelectedMessage(message._id)}
                  onTouchEnd={(e) => handleSwipeDelete(e, message)}
                  className={`flex flex-col ${
                    message.to_user_id !== user._id
                      ? "items-start"
                      : "items-end"
                  }`}
                >
                  <div
                    className={`relative group p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${
                      message.to_user_id !== user._id
                        ? "rounded-bl-none"
                        : "rounded-br-none"
                    }`}
                  >
                    {message.message_type === "image" && (
                      <img
                        src={message.media_url}
                        className="w-full max-w-sm rounded-lg mb-1"
                        alt=""
                      />
                    )}

                    {message.deleted ? (
                      <p className="text-gray-400">This message is deleted</p>
                    ) : (
                      <p>{message.text}</p>
                    )}

                    {/* Edit/Delete buttons */}
                    {message.from_user_id === myId && !message.deleted && (
                      <div className="absolute top-0 right-0 m-1 hidden group-hover:flex gap-1 z-20">
                        <button
                          onClick={() =>
                            setEditModal({
                              open: true,
                              messageId: message._id,
                              text: message.text,
                            })
                          }
                          className="text-xs bg-yellow-200 px-2 py-1 rounded hover:bg-yellow-300 flex items-center"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="text-xs bg-red-200 px-2 py-1 rounded hover:bg-red-300 flex items-center"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input box */}
        <div className="px-4">
          <div className="flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5">
            <button
              onClick={() => setEmojiPicker(!showEmojiPicker)}
              className="text-2xl cursor-pointer"
            >
              😀
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full px-3 md:w-auto md:px-0 flex justify-center animate-fadeInUp z-[999]">
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-3 w-full md:w-[380px] overflow-hidden epr-body">
                  <EmojiPicker
                    onEmojiClick={(emoji) =>
                      setText((prev) => prev + emoji.emoji)
                    }
                  />
                </div>
              </div>
            )}
            <input
              type="text"
              className="flex-1 outline-none text-slate-700"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              onFocus={() => setEmojiPicker(false)}
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
            <label htmlFor="image">
              {image ? (
                <img src={URL.createObjectURL(image)} className="h-8 rounded" />
              ) : (
                <ImageIcon className="size-7 text-gray-400 cursor-pointer" />
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <button
              onClick={sendMessage}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {editModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[999]">
            <div className="bg-white p-5 rounded-lg w-11/12 max-w-md">
              <h2 className="font-medium mb-3">Edit Message</h2>
              <textarea
                className="w-full border p-2 rounded mb-3"
                value={editModal.text}
                onChange={(e) =>
                  setEditModal((prev) => ({ ...prev, text: e.target.value }))
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() =>
                    setEditModal({ open: false, messageId: "", text: "" })
                  }
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() =>
                    handleEditMessage(editModal.messageId, editModal.text)
                  }
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default ChatBox;
