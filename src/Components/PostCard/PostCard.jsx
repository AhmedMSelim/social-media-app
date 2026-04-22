import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { HiDotsHorizontal } from "react-icons/hi";
import { FaThumbsUp } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa6";
import { IoShareSocial } from "react-icons/io5";
import { FaEarthAfrica } from "react-icons/fa6";

import defaultAvatar from "../../assets/default-avatar.png";
import { AuthContext } from "../../Context/AuthContext";
import CommentsList from "../CommentsList/CommentsList";
import CommentCreation from "../CommentCreation/CommentCreation";
import { formatTimeAgo } from "../../utils/timeAgo";
import { FaBookmark } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useLikePost } from "../Hooks/useLikePost";
import { useBookmarkPost } from "../Hooks/useBookmarkPost";
import { usePostLikes } from "../Hooks/usePostLikes";
import LikesModal from "../LikesModal/LikesModal";
import { useEffect } from "react";
import { useRef } from "react";
import { FaImage } from "react-icons/fa";
export default function PostCard({ post, isPostDetails = false }) {
  const { body, image, createdAt, user, id, topComment } = post;
  const { name, photo, _id: userId } = user;
  const [showComments, setShowComments] = useState(isPostDetails);
  const { userId: loggedUserId } = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(body);
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(image);
  const isProfilePost = body?.toLowerCase().includes("profile picture");
  const PLACEHOLDER_IMAGE = defaultAvatar;
  const menuRef = useRef(null);
  const hasImage = !!image || !!previewImage;
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);
  const { mutate: toggleLike } = useLikePost(loggedUserId);
  const isLiked = post.likes?.includes(loggedUserId);
  const likesCount = post.likesCount ?? post.likes?.length ?? 0;
  const { mutate: toggleBookmark, isPending: isBookmarking } =
    useBookmarkPost();
  // const queryClientSaved = useQueryClient();
  const { data: postDetailsData } = useQuery({
    queryKey: ["postDetails", id],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }),
    enabled: isPostDetails, // 👈 مهم
  });
  const cachedPost = postDetailsData?.data?.data;

  const isSaved = cachedPost?.bookmarked ?? post.bookmarked;
  const [localSaved, setLocalSaved] = useState(isSaved);
  useEffect(() => {
    setLocalSaved(isSaved);
  }, [isSaved]);
  const [showLikes, setShowLikes] = useState(false);
  const { data: likesData, isLoading } = usePostLikes(showLikes ? id : null);

  const likes = likesData?.data?.data?.likes || []; //Comments
  function getPostComment() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
      params: { limit: 20 },
    });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setNewImage(file);
    setPreviewImage(URL.createObjectURL(file));
  }

  const { data } = useQuery({
    queryKey: ["getPostComments", id],
    queryFn: getPostComment,
    enabled: showComments || isPostDetails,
  });

  // ================= DELETE =================
  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post Deleted 👍");

      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // 🔥 الشرط المهم
      if (isPostDetails) {
        navigate("/");
      }
    },
    onError: () => toast.error("Error ❌"),
  });

  // updateeeee
  function updatePost() {
    const formData = new FormData();

    formData.append("body", editedText);

    if (newImage) {
      formData.append("image", newImage);
    }

    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      toast.success("Updated ✅");

      setIsEditing(false);
      setNewImage(null);

      queryClient.invalidateQueries(["posts"]);
    },
  });
  if (!body && !image) return null;
  const handleBookmark = () => {
    setLocalSaved((prev) => !prev); // 🔥 instant UI

    toggleBookmark(id, {
      onError: () => {
        // rollback لو السيرفر فشل
        setLocalSaved((prev) => !prev);
      },
    });

    setOpenMenu(false); // 🔥 يقفل المينيو
  };
  return (
    <article className="overflow-visible w-full rounded-none sm:rounded-xl border border-slate-200 bg-white shadow-sm mb-6">
      {/* HEADER */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img
            src={photo}
            className="h-11 w-11 rounded-full object-cover"
            onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
          />

          <div className="min-w-0 flex-1">
            <Link
              to={`/profile/${userId}`}
              className="text-sm font-bold truncate hover:underline cursor-pointer"
            >
              {name}
            </Link>

            <div className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
              @{name} ·
              <span className="font-semibold">{formatTimeAgo(createdAt)}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <FaEarthAfrica size={11} />
                Public
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation(); // 👈 مهم
              setOpenMenu((prev) => !prev);
            }}
            className="rounded-full p-1.5 hover:bg-slate-100"
          >
            <HiDotsHorizontal size={18} />
          </button>

          {openMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
            >
              {/* Save */}
              <button
                onClick={handleBookmark}
                disabled={isBookmarking}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold 
  ${localSaved ? "text-[#1877f2]" : "text-slate-700"} 
  hover:bg-slate-50 
  ${isBookmarking ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isBookmarking ? (
                  <>
                    <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaBookmark size={14} />
                    {localSaved ? "Unsave post" : "Save post"}
                  </>
                )}
              </button>
              {/* Edit + Delete لو البوست بتاعك */}
              {loggedUserId === userId && !isProfilePost && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditedText(body);
                      setPreviewImage(image);
                      setOpenMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <FiEdit size={14} />
                    Edit post
                  </button>

                  <button
                    onClick={() => {
                      deleteMutate();
                      setOpenMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <MdDelete size={14} />
                    Delete post
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="px-4">
        {isEditing && !isProfilePost ? (
          <div className="mt-3 space-y-3">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[110px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1877f2] focus:ring-2"
            />

            {previewImage && (
              <img
                src={previewImage}
                className="w-full max-h-[400px] object-cover rounded-xl"
              />
            )}

            {!isProfilePost && (
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-[#1877f2] hover:text-[#166fe5]">
                <FaImage size={16} />

                <span>{hasImage ? "Change image" : "Upload image"}</span>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedText(body);
                  setPreviewImage(image);
                  setNewImage(null);
                }}
                className="rounded-full border px-3 py-1.5 text-xs font-bold"
              >
                Cancel
              </button>

              <button
                onClick={() => updateMutate()}
                disabled={isUpdating}
                className="flex items-center gap-2 rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
              >
                {isUpdating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        ) : (
          body && <p className="text-sm whitespace-pre-wrap mb-3">{body}</p>
        )}
        {localSaved && (
          <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#e7f3ff] px-2.5 py-1 text-[11px] font-bold text-[#1877f2]">
            <FaBookmark size={12} />
            Saved
          </div>
        )}
      </div>

      {/* IMAGE */}
      {image && !isEditing && (
        <div className="border-y">
          <img
            src={image}
            className="w-full max-h-150 object-cover"
            onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
          />
        </div>
      )}
      <div className="px-4 py-3 text-sm text-slate-500 flex justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-[#1877f2] text-white rounded-full p-1">
            <FaThumbsUp size={12} />
          </span>
          <span
            onClick={() => setShowLikes(true)}
            className="font-semibold hover:text-[#1877f2] cursor-pointer"
          >
            {likesCount} likes
          </span>
        </div>

        <div className="flex gap-3 items-center">
          <span>0 comments</span>
          <span>0 shares</span>

          {!isPostDetails && (
            <button
              onClick={() => navigate(`/postdetails/${id}`)}
              className="px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff] rounded-md"
            >
              View details
            </button>
          )}
        </div>
      </div>

      <div className="border-t mx-4 border-slate-200" />

      {/* ACTIONS */}
      <div className="grid grid-cols-3 p-1 text-sm ">
        <button
          onClick={() => toggleLike(id)}
          className={`cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors sm:gap-2 sm:text-sm ${
            isLiked
              ? "bg-[#e7f3ff] text-[#1877f2]"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FaThumbsUp />
          <span>{isLiked ? "Liked" : "Like"}</span>
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center justify-center gap-2 p-2 hover:bg-slate-100 rounded-md"
        >
          <FaRegCommentDots />
          Comment
        </button>

        <button className="flex items-center justify-center gap-2 p-2 hover:bg-slate-100 rounded-md">
          <IoShareSocial />
          Share
        </button>
      </div>

      {/* 🔥 TOP COMMENT */}
      {topComment && !isPostDetails && !showComments && (
        <div className="mx-4 mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] font-bold text-slate-500 mb-2">
            Top Comment
          </p>

          <div className="flex items-start gap-2">
            <img
              src={topComment?.user?.photo || PLACEHOLDER_IMAGE}
              className="h-8 w-8 rounded-full"
            />

            <div className="bg-white rounded-2xl px-3 py-2 flex-1">
              <p className="text-xs font-bold">{topComment?.user?.name}</p>
              <p className="text-sm text-slate-700">{topComment?.content}</p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/postdetails/${id}`)}
            className="mt-2 text-xs font-bold text-[#1877f2] hover:underline"
          >
            View all comments
          </button>
        </div>
      )}

      {/* COMMENTS */}
      {showComments && (
        <div className="border-t bg-[#f7f8fa] px-4 py-4">
          <CommentsList comments={data?.data.data.comments || []} />
          <CommentCreation postId={id} queryKey={["getPostComments", id]} />
        </div>
      )}

      <LikesModal
        isOpen={showLikes}
        onClose={() => setShowLikes(false)}
        likes={likes}
        isLoading={isLoading}
      />
    </article>
  );
}
