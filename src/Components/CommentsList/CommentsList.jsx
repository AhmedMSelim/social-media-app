import defaultAvatar from "../../assets/default-avatar.png";
import { HiDotsHorizontal } from "react-icons/hi";
import { formatTimeAgo } from "./../../utils/timeAgo";
import { useState, useContext } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiImage } from "react-icons/fi";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

export default function CommentsList({ comments = [] }) {
  const hasComments = comments.length > 0;

  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [removeOldImage, setRemoveOldImage] = useState(false);
  const { userId } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  // delete
  const { mutate: deleteComment } = useMutation({
    mutationFn: ({ commentId, postId }) =>
      axios.delete(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),

    onSuccess: () => {
      toast.success("Deleted ✅");
      setDeletingId(null);
      queryClient.invalidateQueries(["getPostComments"]);
    },

    onError: () => {
      setDeletingId(null);
      toast.error("Delete failed ❌");
    },
  });

  const { mutate: updateMutate, isPending } = useMutation({
    mutationFn: ({ commentId, postId }) => {
      const formData = new FormData();

      formData.append("content", editedText);

      if (newImage) {
        formData.append("image", newImage);
      }

      return axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
    },
    onSuccess: () => {
      toast.success("Updated ✅");
      setEditingId(null);
      setNewImage(null);
      setPreviewImage(null);
      setRemoveOldImage(false);
      queryClient.invalidateQueries(["getPostComments"]);
    },
  });

  return (
    <div className="px-4 py-3 bg-[#f7f8fa] border-t">
      <div className="mb-3 flex justify-between items-center bg-white p-2 rounded-xl border">
        <p className="font-bold text-sm">Comments ({comments.length})</p>

        <select className="text-xs border rounded-md px-2 py-1">
          <option>Most relevant</option>
          <option>Newest</option>
        </select>
      </div>

      {!hasComments && (
        <div className="rounded-2xl border bg-white px-4 py-8 text-center">
          <div className="mb-3 text-2xl">💬</div>
          <p className="text-lg font-bold text-slate-800">No comments yet</p>
          <p className="text-sm text-slate-500">Be the first to comment.</p>
        </div>
      )}

      {hasComments &&
        comments.map((c) => (
          <div key={c._id} className="flex items-start gap-2 mb-3">
            <img
              src={c.commentCreator?.photo || defaultAvatar}
              className="h-9 w-9 rounded-full object-cover"
              onError={(e) => (e.target.src = defaultAvatar)}
            />

            <div className="flex-1">
              <div className="relative rounded-2xl bg-[#f0f2f5] px-3 py-2">
                <p className="text-xs font-bold text-slate-900">
                  {c.commentCreator?.name || "User"}
                </p>

                <p className="text-xs text-slate-500">
                  @{c.commentCreator?.name} · {formatTimeAgo(c.createdAt)}
                </p>

                {editingId === c._id ? (
                  <>
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="mt-2 w-full rounded border p-1 text-sm"
                    />

                    {c.image && !previewImage && (
                      <div className="mt-2 w-fit">
                        <img
                          src={c.image}
                          className="max-w-[150px] rounded mt-1 border"
                        />
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-2">
                      <label className="cursor-pointer flex items-center gap-1 text-xs text-slate-500 hover:text-blue-500">
                        <FiImage size={16} />
                        Add photo
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            setNewImage(file);
                            setPreviewImage(URL.createObjectURL(file));
                          }}
                        />
                      </label>
                    </div>

                    {previewImage && (
                      <div className="mt-2 relative w-fit">
                        <img
                          src={previewImage}
                          className="max-w-[150px] rounded mt-1 border"
                        />

                        <button
                          onClick={() => {
                            setPreviewImage(null);
                            setNewImage(null);
                          }}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setPreviewImage(null);
                          setNewImage(null);
                          setRemoveOldImage(false);
                          setEditedText("");
                        }}
                        className="text-xs px-2 py-1 border rounded"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() =>
                          updateMutate({
                            commentId: c._id,
                            postId: c.post?._id || c.post,
                          })
                        }
                        disabled={isPending}
                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded flex items-center gap-1 disabled:opacity-60"
                      >
                        {isPending ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {c.content && <p className="mt-1 text-sm">{c.content}</p>}

                    {c.image && (
                      <img
                        src={c.image}
                        className="mt-2 rounded-lg max-w-[200px]"
                      />
                    )}
                  </>
                )}
              </div>

              <div className="mt-1 flex justify-between">
                <span className="text-xs text-gray-400">
                  {formatTimeAgo(c.createdAt)}
                </span>

                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId((prev) => (prev === c._id ? null : c._id))
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <HiDotsHorizontal />
                  </button>

                  {openMenuId === c._id && userId === c.commentCreator?._id && (
                    <div className="absolute right-0 mt-1 bg-white border rounded shadow z-10">
                      <button
                        onClick={() => {
                          setEditingId(c._id);
                          setEditedText(c.content || ""); // 👈 مهم
                          setPreviewImage(null);
                          setNewImage(null);
                          setOpenMenuId(null);
                        }}
                        className="flex gap-2 px-3 py-1 text-xs hover:bg-gray-50"
                      >
                        <FiEdit size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            commentId: c._id,
                            postId: c.post?._id || c.post,
                          })
                        }
                        className="flex gap-2 px-3 py-1 text-xs text-red-500 hover:bg-red-50"
                      >
                        <MdDelete size={13} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ConfirmModal
              open={!!deleteTarget}
              onClose={() => setDeleteTarget(null)}
              loading={deletingId === deleteTarget?.commentId}
              title="Confirm delete"
              message="Delete this comment?"
              confirmText="Delete"
              onConfirm={() => {
                setDeletingId(deleteTarget.commentId);

                deleteComment(deleteTarget, {
                  onSettled: () => {
                    setDeletingId(null);
                    setDeleteTarget(null);
                  },
                });
              }}
            />
          </div>
        ))}
    </div>
  );
}
