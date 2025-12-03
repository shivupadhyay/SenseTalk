import React, { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  Heart,
  ImageIcon,
  MessageCircle,
  MoreVertical,
  Pencil,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import moment from "moment";
import { dummyUserData } from "../assets/assets";
import confetti from "canvas-confetti";
import { Form, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const PostCard = ({ post, onDelete, fetchFeeds }) => {
  const postWithHashTags = post.content.replace(
    /(#\w+)/g,
    '<span class="text-indigo-600">$1</span>'
  );
  const currentUser = useSelector((state) => state.user.value);
  const [likes, setLikes] = useState(post.likes_count);
  const [openMenu, setOpenMenu] = useState(false);
  const [showBigHeart, setShowBigheart] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(post.content || "");
  const [existingImages, setExistingImages] = useState(post.image_urls || []);
  const [newImages, setNewImages] = useState([]);
  const [isSaved, setIsSaved] = useState(
    currentUser?.saves?.includes(post._id) || false
  );

  const { getToken } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutSide(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [dropdownRef]);

  const handleLike = async () => {
    try {
      const { data } = await api.post(
        `/api/post/like`,
        { postId: post._id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setLikes((prev) => {
          if (prev.includes(currentUser._id)) {
            return prev.filter((id) => id != currentUser._id);
          } else {
            return [...prev, currentUser._id];
          }
        });
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDoubleTap = () => {
    handleLike();
    setShowBigheart(true);
    setTimeout(() => {
      setShowBigheart(false);
    }, 700);
  };

  const handleDelete = async () => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/post/delete",
        { postId: post._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success("Post deleted.");
        onDelete(post._id);
        setOpenMenu(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navigate = useNavigate();

  const removeExistingImage = (removeIndex) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== removeIndex));
  };
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const saveChanges = async () => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("postId", post._id);
      formData.append("content", caption);
      existingImages.forEach((img) => formData.append("existingImages", img));
      newImages.forEach((img) => formData.append("newImages", img));

      const { data } = await api.put("/api/post/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Post updated");
        setIsEditing(false);
        fetchFeeds();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toogleSave = async () => {
    try {
      const token = await getToken();

      const { data } = await api.post(
        "/api/post/toggle-save",
        {
          postId: post._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setIsSaved(data.isSaved);
      if (data.isSaved) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.7 },
        });

        toast.success("Saved to your collection!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          icon: "📌",
        });
      } else {
        toast("Removed from your saved posts", {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#222",
            color: "white",
          },
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // return (
  //   <div
  //     className="relative bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl"
  //     onDoubleClick={handleDoubleTap}
  //   >
  //     {/* Single Big Heart Animation */}
  //     {showBigHeart && (
  //       <Heart
  //         className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
  //                    text-red-500 fill-red-500 w-24 h-24 animate-pingHeart pointer-events-none z-50"
  //       />
  //     )}
  //     {/* User Info */}
  //     <div className="flex justify-between items-start">
  //       <div
  //         onClick={() => navigate("/profile/" + post.user._id)}
  //         className="inline-flex items-center gap-3 cursor-pointer"
  //       >
  //         <img
  //           src={post.user.profile_picture}
  //           alt=""
  //           className="w-10 h-10 rounded-full shadow"
  //         />
  //         <div>
  //           <div className="flex items-center space-x-1">
  //             <span>{post.user.full_name}</span>
  //             <BadgeCheck className="w-4 h-4 text-blue-500" />
  //           </div>
  //           <div className="text-gray-500 text-sm">
  //             @{post.user.username} . {moment(post.createdAt).fromNow()}
  //           </div>
  //         </div>
  //       </div>
  //       {post.user._id === currentUser._id && (
  //         <div className="relative">
  //           <MoreVertical
  //             className="w-5 h-5 text-gray-600 cursor-pointer"
  //             onClick={() => setOpenMenu(!openMenu)}
  //           />

  //           {openMenu && (
  //             <div
  //               ref={dropdownRef}
  //               className="absolute right-0 top-6  bg-white/50 backdrop-blur-md shadow-lg rounded-xl w-40 z-50 p-2 animate-dropdown"
  //             >
  //               <button
  //                 onClick={() => navigate(`/create-post/${post._id}`)}
  //                 className="flex items-center gap-2 w-full px-3 py-2
  //                    text-blue-600 font-medium rounded-lg
  //                    hover:bg-blue-100 active:scale-95
  //                    transition-all duration-200 cursor-pointer"
  //               >
  //                 <Pencil className="w-4 h-4" />
  //                 Edit Post
  //               </button>
  //               <button
  //                 onClick={handleDelete}
  //                 className=" flex items-center gap-2 w-full px-3 py-2
  //   text-white font-medium rounded-lg
  //   bg-gradient-to-r from-red-600 to-red-800
  //   hover:opacity-90 active:scale-95
  //   transition-all duration-200 border-none cursor-pointer"
  //               >
  //                 <Trash2 className="w-4 h-4" />
  //                 Delete Post
  //               </button>
  //             </div>
  //           )}
  //         </div>
  //       )}
  //     </div>
  //     {/* Content */}
  //     {isEditing ? (
  //       <textarea
  //         className="w-full p-2 border rounded"
  //         rows={3}
  //         value={caption}
  //         onChange={(e) => setCaption(e.target.value)}
  //       />
  //     ) : (
  //       caption && (
  //         <div
  //           className="relative text-gray-800 text-sm whitespace-pre-line"
  //           dangerouslySetInnerHTML={{ __html: postWithHashTags }}
  //         />
  //       )
  //     )}

  //     {/* {post.content && (
  //       <div
  //         className="relative text-gray-800 text-sm whitespace-pre-line"
  //         dangerouslySetInnerHTML={{ __html: postWithHashTags }}
  //       />
  //     )} */}
  //     {/* Images */}
  //     <div className="relative grid grid-cols-2 gap-2 select-none">
  //       {exisitingImages.map((img, index) => (
  //         <img
  //           src={img}
  //           key={index}
  //           className={`w-full h-48 object-cover rounded-lg ${
  //             post.image_urls.length === 1 && "col-span-2 h-auto "
  //           } `}
  //           alt=""
  //         />
  //       ))}
  //     </div>
  //     {/* Actions */}
  //     <div className="flex items-center gap-4 text-gray-600 text-sm pt-2  border-t border-gray-300">
  //       <div className="flex items-center gap-1">
  //         <Heart
  //           className={`w-4 h-4 cursor-pointer ${
  //             likes.includes(currentUser._id) && "text-red-500 fill-red-500"
  //           }`}
  //           onClick={handleLike}
  //         />
  //         <span>{likes.length}</span>
  //       </div>

  //       <div className="flex items-center gap-1">
  //         <MessageCircle className="w-4 h-4" />
  //         <span>{12}</span>
  //       </div>

  //       <div className="flex items-center gap-1">
  //         <Share2 className="w-4 h-4" />
  //         <span>{7}</span>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div
      className="relative bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl"
      onDoubleClick={handleDoubleTap}
    >
      {showBigHeart && (
        <Heart className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 fill-red-500 w-24 h-24 animate-pingHeart pointer-events-none z-50" />
      )}

      {/* User Info */}
      <div className="flex justify-between items-start">
        <div
          onClick={() => navigate("/profile/" + post.user._id)}
          className="inline-flex items-center gap-3 cursor-pointer"
        >
          <img
            src={post.user.profile_picture}
            alt=""
            className="w-10 h-10 rounded-full shadow"
          />
          <div>
            <div className="flex items-center space-x-1">
              <span>{post.user.full_name}</span>
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-gray-500 text-sm">
              @{post.user.username} . {moment(post.createdAt).fromNow()}
            </div>
          </div>
        </div>

        {post.user._id === currentUser._id && (
          <div className="relative">
            <MoreVertical
              className="w-5 h-5 text-gray-600 cursor-pointer"
              onClick={() => setOpenMenu(!openMenu)}
            />
            {openMenu && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-6 bg-white/50 backdrop-blur-md shadow-lg rounded-xl w-40 z-50 p-2 animate-dropdown"
              >
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-blue-600 font-medium rounded-lg hover:bg-blue-100 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Post
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-2 text-red-600 font-medium rounded-lg hover:bg-blue-100 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ------------------ CONTENT ------------------ */}
      {isEditing ? (
        <div className="p-[2px] rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 animate-floatUp">
          <textarea
            className="w-full p-3 rounded-lg bg-white focus:outline-none"
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
      ) : (
        caption && (
          <div
            className="relative text-gray-800 text-sm whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: postWithHashTags }}
          />
        )
      )}

      {/* ------------------ IMAGES ------------------ */}
      <div className="relative grid grid-cols-2 gap-2 select-none">
        {existingImages.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img}
              className={`w-full h-48 object-cover rounded-lg ${
                existingImages.length === 1 && "col-span-2 h-auto"
              }`}
              alt=""
            />
            {isEditing && (
              <button
                onClick={() => removeExistingImage(index)}
                className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ))}

        {newImages.map((img, index) => (
          <div key={`new-${index}`} className="relative">
            <img
              src={URL.createObjectURL(img)}
              className="w-full h-48 object-cover rounded-lg"
              alt=""
            />
            {isEditing && (
              <button
                onClick={() => removeNewImage(index)}
                className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-4">
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
            <ImageIcon className="w-5 h-5" />
            <span>Choose Files</span>
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleNewImages}
            />
          </label>
        </div>
      )}

      {/* ------------------ ACTIONS ------------------ */}
      {isEditing ? (
        <div className="flex gap-3 mt-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg transition cursor-pointer"
            onClick={() => {
              setIsEditing(false);
              setCaption(post.content);
              setExistingImages(post.image_urls);
              setNewImages([]);
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 cursor-pointer"
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
          <div className="flex items-center gap-1">
            <Heart
              className={`w-4 h-4 cursor-pointer ${
                likes.includes(currentUser._id) && "text-red-500 fill-red-500"
              }`}
              onClick={handleLike}
            />
            <span>{likes.length}</span>
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{12}</span>
          </div>

          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span>{7}</span>
          </div>
          <div
            onClick={toogleSave}
            className="relative ml-auto cursor-pointer group"
          >
            {isSaved ? (
              <BookmarkCheck
                className="w-5 h-5 text-orange-500 transition-all duration-200"
                fill="currentColor"
                stroke="currentColor"
                style={{ fill: "currentColor", stroke: "currentColor" }}
              />
            ) : (
              <Bookmark
                className="w-5 h-5 text-gray-600 transition-all"
                fill="none"
                stroke="currentColor"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
