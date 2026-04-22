import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaImage, FaSmile } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import defaultAvatar from "../../assets/default-avatar.png";
import { useRef } from "react";
import EmojiPicker from "emoji-picker-react";

export default function CommentCreation({ postId, queryKey }) {
  const query = useQueryClient();

  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef(null);
  const textValue = watch("body");
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  function createComment(formData) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createComment,

    onSuccess: () => {
      query.invalidateQueries({ queryKey });
      reset();
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";

      toast.success("Comment Created Successfully ✅");
    },

    onError: () => {
      toast.error("Can't Create Comment ⛔");
    },
  });

  function onSubmit(values) {
    const file = fileRef.current?.files[0];

    if (!values.body && !file) return;

    const formData = new FormData();

    if (values.body) formData.append("content", values.body);
    if (file) formData.append("image", file);

    mutate(formData);
  }

  const canSend = textValue?.trim() || preview;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="mt-3 flex items-start gap-2 px-4 pb-3">
      <img src={defaultAvatar} className="h-9 w-9 rounded-full object-cover" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white"
      >
        {preview && (
          <div className="mt-2 relative w-fit">
            <img src={preview} className="max-w-[120px] rounded-lg border" />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="absolute -top-2 -right-2 bg-black text-white rounded-full px-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        <textarea
          {...register("body")}
          placeholder="Comment..."
          rows="1"
          className="max-h-[140px] min-h-[40px] w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-slate-500"
        />

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-500 hover:bg-slate-200 hover:text-emerald-600">
              <FaImage />

              <input
                ref={fileRef}
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setPreview(URL.createObjectURL(file));
                }}
              />
            </label>

            <div className="relative" ref={emojiRef}>
              <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className="inline-flex items-center justify-center rounded-full p-2 text-slate-500 hover:bg-slate-200 hover:text-amber-500"
              >
                <FaSmile />
              </button>

              {showEmoji && (
                <div className="absolute bottom-12 left-0 z-50">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      const currentText = textValue || "";
                      reset({
                        body: currentText + emojiData.emoji,
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSend || isPending}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm hover:bg-[#166fe5] disabled:bg-[#9ec5ff]"
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <IoSend />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
