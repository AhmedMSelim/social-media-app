import React, { useRef, useState } from "react";
import { FaImage, FaSmile } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { FaEarthAfrica } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

export default function CreatePostCard() {
  const [text, setText] = useState("");
  const fileRef = useRef(null);
  const { userData } = useContext(AuthContext);
  const [imagePreview, setImagePreview] = useState(null);
  const [privacy, setPrivacy] = useState("public");
  const canPost = text.trim() || imagePreview;
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const queryClient = useQueryClient();

  function createPost(formData) {
    return axios.post("https://route-posts.routemisr.com/posts", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("Post created successfully ✅");
      setText("");
      fileRef.current.value = "";
      setImagePreview(null);
    },

    onError: () => {
      toast.error("Something went wrong ❌");
    },
  });

  const removeImage = () => {
    setImagePreview(null);
    fileRef.current.value = "";
  };

  function handlePost() {
    const file = fileRef.current.files[0];

    if (!text.trim() && !file) return;

    const formData = new FormData();

    if (text.trim()) formData.append("body", text);
    if (file) formData.append("image", file);

    formData.append("privacy", privacy);

    mutate(formData);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        <img
          src={
            userData?.photo ||
            "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
          }
          className="h-11 w-11 rounded-full object-cover"
        />

        <div className="flex-1">
          <p className="text-base font-extrabold text-slate-900">
            {userData?.name}
          </p>

          <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
            <FaEarthAfrica className="text-xs" />

            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="public">Public</option>
              <option value="following">Followers</option>
              <option value="only_me">Only me</option>
            </select>
          </div>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
          placeholder={`What's on your mind, ${userData?.name}?`}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
        />
      </div>

      {imagePreview && (
        <div className="relative mt-3">
          <img src={imagePreview} className="rounded-xl w-full object-cover" />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-black/70 text-white rounded-full px-2"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            <FaImage className="text-emerald-600 text-lg" />
            <span className="hidden sm:inline">Photo/video</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImage}
            />
          </label>

          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            <FaSmile className="text-amber-500 text-lg" />
            <span className="hidden sm:inline">Feeling/activity</span>
          </button>
        </div>

        <button
          disabled={!canPost || isPending}
          onClick={handlePost}
          className="flex items-center gap-2 rounded-lg bg-[#1877f2] px-5 py-2 text-sm font-extrabold text-white disabled:opacity-60"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              Post <IoSend />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
